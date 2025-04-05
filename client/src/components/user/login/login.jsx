import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../InputField";
import { ButtonMediumFullWide } from "../../ui/Buttons";
import LoadingSpinner from "../../ui/LoadingSpinner";
import {
  useEmailValidator,
  usePasswordValidator,
} from "../../../hooks/input-sanitizers/useAuthValidators";
import { AuthContext } from "../../../context/AuthProvider"; // Import AuthContext
import { kAPI_URL } from '../../../api/utils/constants';

const Login = ({ toggle }) => {
  const [userType, setUserType] = useState("respondent");
  const [username, setUsername] = useState(""); // 新增：用户名状态
  const {
    value: emailValue,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    markAsTouched: emailMarkAsTouched,
    inputReset: emailInputReset,
  } = useEmailValidator();

  const {
    value: passwordValue,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    markAsTouched: passwordMarkAsTouched,
    inputReset: passwordInputReset,
  } = usePasswordValidator();

  // State variables for error and success messages
  const { setIsLoggedIn, fetchUserData } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // useNavigate hook to navigate to different pages
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (userType === "admin") {
      emailMarkAsTouched();
      if (emailHasError) {
        setError("Invalid email address. Please try again.");
        setSuccess(null);
        return;
      }
    } else {
      if (!username.trim()) {
        setError("Please enter your username.");
        setSuccess(null);
        return;
      }
    }

    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const endpoint = userType === "admin" 
        ? `${kAPI_URL}/users/login`
        : `${kAPI_URL}/respondents/login`;

      const loginData = userType === "admin"
        ? {
            email: emailValue.trim(),
            password: passwordValue,
          }
        : {
            username: username.trim(),
            password: passwordValue,
          };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userType", userType); // 存储用户类型
      setIsLoggedIn(true);
      await fetchUserData();
      setError(null);
      setUsername(""); // 重置用户名
      emailInputReset();
      passwordInputReset();
      setSuccess("Login successful!");
      setIsLoading(false);
      setTimeout(() => {
        document.getElementById("auth_modal").close();
        navigate("/dataanalyst");
        setSuccess(null);
        setIsLoading(false);
      }, 2000);
    } catch (err) {
      // If the response is not successful, set error message
      setError(err.message || "Invalid credentials. Please try again.");
      setSuccess(null);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <h2 className="card-title">Login</h2>
      
      {/* 用户类型选择器 */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Login as</span>
        </label>
        <div className="flex gap-2">
          <button
            className={`btn btn-sm ${userType === "respondent" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => {
              setUserType("respondent");
              setUsername("");
              emailInputReset();
            }}
          >
            Respondent
          </button>
          <button
            className={`btn btn-sm ${userType === "admin" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => {
              setUserType("admin");
              setUsername("");
              emailInputReset();
            }}
          >
            Admin
          </button>
        </div>
      </div>

      {/* 根据用户类型显示不同的输入字段 */}
      {userType === "admin" ? (
        <InputField
          label="Email"
          type="text"
          placeholder="Please enter your email address"
          value={emailValue}
          onChange={emailChangeHandler}
          onBlur={emailMarkAsTouched}
          hasError={emailHasError}
          errorMessage="Please enter a valid email address."
        />
      ) : (
        <InputField
          label="Username"
          type="text"
          placeholder="Please enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          hasError={false}
        />
      )}

      {/* Input field for password */}
      <InputField
        label="Password"
        type="password"
        placeholder="Please enter your password"
        value={passwordValue}
        onChange={passwordChangeHandler}
        onBlur={passwordMarkAsTouched}
        onKeyDown={(e) => e.key === "Enter" && handleLogin(e)} // Trigger login on Enter key press
      />
      {/* Login button */}
      <div className="form-control mt-6">
        <ButtonMediumFullWide
          onClick={handleLogin}
          textColor={"text-primary-content"}
        >
          {isLoading ? <LoadingSpinner /> : "Login"}
        </ButtonMediumFullWide>
      </div>
      {/* Error and success messages */}
      {error && <div className="pt-3 text-error">{error}</div>}
      {success && <div className="pt-3 text-success">{success}</div>}

      <p className="mt-4">
        Don't have an account?{" "}
        <button className="text-info hover:underline" onClick={toggle}>
          Register here
        </button>
      </p>
    </div>
  );
};

export default Login;
