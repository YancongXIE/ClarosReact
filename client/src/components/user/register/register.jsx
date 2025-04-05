import { useState } from "react";
import InputField from "../InputField";
import { ButtonMediumFullWide } from "../../ui/Buttons";
import LoadingSpinner from "../../ui/LoadingSpinner";
import {
  useEmailValidator,
  usePasswordValidator,
  useNameValidator,
} from "../../../hooks/input-sanitizers/useAuthValidators";

function Register({ toggle }) {
  const {
    value: firstName,
    hasError: firstNameHasError,
    valueChangeHandler: firstNameChangeHandler,
    markAsTouched: firstNameMarkAsTouched,
    inputReset: firstNameInputReset,
  } = useNameValidator();

  const {
    value: lastName,
    hasError: lastNameHasError,
    valueChangeHandler: lastNameChangeHandler,
    markAsTouched: lastNameMarkAsTouched,
    inputReset: lastNameInputReset,
  } = useNameValidator();

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

  // State variables for local area, error and success messages
  const [localArea, setLocalArea] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Local area options
  const localAreaOptions = ["Cairns", "Gold Coast", "Noosa", "Whitsunday"];

  // Function to handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailValue,
          password: passwordValue,
          firstName,
          lastName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      firstNameInputReset();
      lastNameInputReset();
      emailInputReset();
      passwordInputReset();
      setLocalArea("");
      // Reset error and set success message
      setError(null);
      setSuccess("Registration successful!");
      setIsLoading(true);
      setTimeout(() => {
        document.getElementById("auth_modal").close();
        setSuccess(null);
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col">
      <h2 className="card-title">Register</h2>
      {/* Input field for first name */}
      <InputField
        label="First Name"
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={firstNameChangeHandler}
        onBlur={firstNameMarkAsTouched}
        hasError={firstNameHasError}
        errorMessage="Name can only contain letters, hyphens, apostrophes, periods, and spaces."
      />
      {/* Input field for last name */}
      <InputField
        label="Last Name"
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={lastNameChangeHandler}
        onBlur={lastNameMarkAsTouched}
        hasError={lastNameHasError}
        errorMessage="Name can only contain letters, hyphens, apostrophes, periods, and spaces."
      />
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
        placeholder="Password"
        value={passwordValue}
        onChange={passwordChangeHandler}
        onBlur={passwordMarkAsTouched}
        hasError={passwordHasError}
        errorMessage="Password must be more than 8 characters long, include an
                  uppercase letter, a number, and a special character."
      />

      {/* Register button */}
      <div className="form-control mt-6">
        <ButtonMediumFullWide
          onClick={handleRegister}
          textColor={"text-primary-content"}
        >
          {isLoading ? <LoadingSpinner /> : "Register"}
        </ButtonMediumFullWide>
      </div>

      {/* Error and success messages */}
      {error && <div className="pt-3 text-error">{error}</div>}
      {success && <div className="pt-3 text-success">{success}</div>}

      <p className="mt-4">
        Already have an account?{" "}
        <button className="text-info hover:underline" onClick={toggle}>
          Login here
        </button>
      </p>
    </div>
  );
}

export default Register;
