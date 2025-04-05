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

const Login = ({ toggle }) => {
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
    // Prevent default form submission
    e.preventDefault();

    emailMarkAsTouched();
    passwordMarkAsTouched();

    if (emailHasError || passwordHasError) {
      setError("Invalid email or password. Please try again.");
      setSuccess(null);
      return;
    }

    const trimmedEmail = emailValue.trim();

    passwordInputReset();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      // Send a POST request to login endpoint with email and password
      const res = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password: passwordValue,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed.");
      }

      localStorage.setItem("token", data.token);
      setIsLoggedIn(true);
      await fetchUserData();
      setError(null);
      emailInputReset();
      passwordInputReset();
      setSuccess("Login successful!");
      setIsLoading(false);
      setTimeout(() => {
        document.getElementById("auth_modal").close();
        navigate("/dashboard");
        setSuccess(null);
        setIsLoading(false);
      }, 2000);
    } catch (err) {
      // If the response is not successful, set error message
      setError(err.message || "User or Password is incorrect.");
      setSuccess(null);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <h2 className="card-title">Login</h2>
      {/* Input field for email */}
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
      {/* Input field for password */}
      <InputField
        label="Password"
        type="password"
        placeholder={"Please enter your password"}
        value={passwordValue}
        onChange={passwordChangeHandler}
        onBlur={passwordMarkAsTouched}
        // hasError={passwordHasError}
        // errorMessage="The password you've entered is incorrect. Please try again."
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
