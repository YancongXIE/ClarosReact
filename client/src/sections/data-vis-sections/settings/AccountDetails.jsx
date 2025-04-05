import { useEffect, useState, useContext } from "react";
import InputField from "../../../components/User/InputField";
import {
  useNameValidator,
  useEmailValidator,
  usePasswordValidator,
} from "../../../hooks/input-sanitizers/useAuthValidators";
import { ButtonMediumWide } from "../../../components/ui/Buttons";
import { AuthContext } from "../../../context/AuthProvider";
import { kAPI_URL } from '../../../api/utils/constants';

const AccountDetails = ({ data }) => {
  const { fetchUserData } = useContext(AuthContext);

  const {
    value: firstName,
    hasError: firstNameHasError,
    valueChangeHandler: firstNameChangeHandler,
    markAsTouched: firstNameMarkAsTouched,
    inputReset: firstNameInputReset,
    setValue: setFirstName,
  } = useNameValidator();

  const {
    value: lastName,
    hasError: lastNameHasError,
    valueChangeHandler: lastNameChangeHandler,
    markAsTouched: lastNameMarkAsTouched,
    inputReset: lastNameInputReset,
    setValue: setLastName,
  } = useNameValidator();

  const {
    value: emailValue,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    markAsTouched: emailMarkAsTouched,
    inputReset: emailInputReset,
    setValue: setEmail,
  } = useEmailValidator();

  const {
    value: passwordValue,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    markAsTouched: passwordMarkAsTouched,
    inputReset: passwordInputReset,
  } = usePasswordValidator();


  const [initialData, setInitialData] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Check if the user data has been fetched
  // Object.keys(data).length === 0 checks if the object is empty
  useEffect(() => {
    if (data && Object.keys(initialData).length === 0) {
      setFirstName(data.user.firstName || "");
      setLastName(data.user.lastName || "");
      setEmail(data.user.email || "");
      setInitialData({
        firstName: data.user.firstName || "",
        lastName: data.user.lastName || "",
        email: data.user.email || "",
      });
    }
  }, [data, initialData]);

  // Check if the data has changed
  const isChanged =
    firstName !== initialData.firstName ||
    lastName !== initialData.lastName ||
    emailValue !== initialData.email ||
    passwordValue !== "" ||
    firstNameHasError ||
    lastNameHasError ||
    emailHasError ||
    passwordHasError;

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      const response = await fetch(`${kAPI_URL}/users/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email: emailValue,
          password: passwordValue,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update user details");
      }

      if (data.success) {
        alert("User details updated successfully");
        // Optionally, reset the initial data to the updated values
        setInitialData({
          firstName,
          lastName,
          email: emailValue,
        });
        passwordInputReset(); // Reset password field

        // Update cached user data in local storage
        const updatedUserData = {
          email: emailValue,
          firstName,
          lastName,
        };
        localStorage.setItem("userData", JSON.stringify(updatedUserData));

        // Refresh user data in the context
        fetchUserData();
      }
    } catch (error) {
      alert("Failed to update user details");
    }
  };

  return (
    <div className="collapse-content text-primary-content">
      <InputField
        label="First Name"
        labelClassName={"text-primary-content"}
        type="text"
        placeholder="First Name"
        className="lg:w-1/2 md:w-[400px] w-[400px]"
        value={firstName}
        onChange={firstNameChangeHandler}
        onBlur={firstNameMarkAsTouched}
        hasError={firstNameHasError}
        errorMessage="Name can only contain letters, hyphens, apostrophes, periods, and spaces."
      />

      <InputField
        label="Last Name"
        labelClassName={"text-primary-content"}
        type="text"
        placeholder="Last Name"
        className="lg:w-1/2 md:w-[400px] w-[400px]"
        value={lastName}
        onChange={lastNameChangeHandler}
        onBlur={lastNameMarkAsTouched}
        hasError={lastNameHasError}
        errorMessage="Name can only contain letters, hyphens, apostrophes, periods, and spaces."
      />

      <InputField
        label="Email Address"
        labelClassName={"text-primary-content"}
        type="email"
        placeholder="Email Address"
        className="lg:w-1/2 md:w-[400px] w-[400px]"
        value={emailValue}
        onChange={emailChangeHandler}
        onBlur={emailMarkAsTouched}
        hasError={emailHasError}
        errorMessage="Please enter a valid email address"
      />



      <InputField
        label="Reset Password"
        labelClassName={"text-primary-content"}
        type="password"
        placeholder="Password"
        className="lg:w-1/2 md:w-[400px] w-[400px]"
        value={passwordValue}
        onChange={passwordChangeHandler}
        onBlur={passwordMarkAsTouched}
        hasError={passwordHasError}
        errorMessage="Password must be more than 8 characters long, include an uppercase letter, a number, and a special character."
      />

      {/* Button is disabled if data is not changed and fields have any errors */}
      <div className="form-control mt-6">
        <ButtonMediumWide
          textColor={"text-secondary-content -auto inline-block"}
          className="w-auto inline-block"
          disabled={
            !isChanged ||
            firstNameHasError ||
            lastNameHasError ||
            emailHasError ||
            passwordHasError
          }
          onClick={handleUpdate}
        >
          Change
        </ButtonMediumWide>
      </div>
      {/* Error and success messages */}
      {error && <div className="pt-3 text-error">{error}</div>}
      {success && <div className="pt-3 text-success">{success}</div>}
    </div>
  );
};

export default AccountDetails;
