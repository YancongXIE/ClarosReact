import { useEffect, useState } from "react";
import InputField from "../../../components/User/InputField";
import {
  useNameValidator,
  useEmailValidator,
  useCardNumberValidator,
  useCVVValidator,
  useExpiryDateValidator,
} from "../../../hooks/input-sanitizers/useAuthValidators";
import { ButtonMediumWide } from "../../../components/ui/Buttons";

const BillingInformation = ({ data }) => {
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
    value: cardNumber,
    hasError: cardNumberHasError,
    valueChangeHandler: cardNumberChangeHandler,
    markAsTouched: cardNumberMarkAsTouched,
    inputReset: cardNumberInputReset,
    setValue: setCardNumber,
  } = useCardNumberValidator();

  const {
    value: cvv,
    hasError: cvvHasError,
    valueChangeHandler: cvvChangeHandler,
    markAsTouched: cvvMarkAsTouched,
    inputReset: cvvInputReset,
    setValue: setCvv,
  } = useCVVValidator();

  const {
    value: expiryDate,
    hasError: expiryDateHasError,
    valueChangeHandler: expiryDateChangeHandler,
    markAsTouched: expiryDateMarkAsTouched,
    inputReset: expiryDateInputReset,
    setValue: setExpiryDate,
  } = useExpiryDateValidator();

  const [organisation, setOrganisation] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [initialData, setInitialData] = useState({});

  // Check if data is available and initialData is empty
  useEffect(() => {
    if (data && Object.keys(initialData).length === 0) {
      setFirstName(data.user.firstName || "");
      setLastName(data.user.lastName || "");
      setEmail(data.user.email || "");
      setOrganisation(data.user.Organisation || "");
      setStreetAddress(data.user.StreetAddress || "");
      setCity(data.user.City || "");
      setPostcode(data.user.Postcode || "");
      setCardNumber(data.user.CardNumber || "");

      const expiryDate = data.user.ExpiryDate
        ? new Date(data.user.ExpiryDate).toISOString().split("T")[0]
        : "";
      setExpiryDate(expiryDate);

      setCvv(data.user.CVV || "");
      setInitialData({
        firstName: data.user.firstName || "",
        lastName: data.user.lastName || "",
        email: data.user.email || "",
        organisation: data.user.Organisation || "",
        streetAddress: data.user.StreetAddress || "",
        city: data.user.City || "",
        postcode: data.user.Postcode || "",
        cardNumber: data.user.CardNumber || "",
        expiryDate: expiryDate,
        cvv: data.user.CVV || "",
      });
    }
  }, [data, initialData]);

  // Check if any field has been changed
  const isChanged =
    firstName !== initialData.firstName ||
    lastName !== initialData.lastName ||
    emailValue !== initialData.email ||
    organisation !== initialData.organisation ||
    streetAddress !== initialData.streetAddress ||
    city !== initialData.city ||
    postcode !== initialData.postcode ||
    cardNumber !== initialData.cardNumber ||
    expiryDate !== initialData.expiryDate ||
    cvv !== initialData.cvv ||
    firstNameHasError ||
    lastNameHasError ||
    emailHasError ||
    cardNumberHasError ||
    cvvHasError ||
    expiryDateHasError;

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      const response = await fetch("http://localhost:3000/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email: emailValue,
          Organisation: organisation,
          StreetAddress: streetAddress,
          City: city,
          Postcode: postcode,
          CardNumber: cardNumber,
          ExpiryDate: expiryDate,
          CVV: cvv,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update billing information");
      }

      if (data.success) {
        alert("Billing details updated successfully");
        // Optionally, reset the initial data to the updated values
        setInitialData({
          firstName,
          lastName,
          email: emailValue,
          organisation,
          streetAddress,
          city,
          postcode,
          cardNumber,
          expiryDate,
          cvv,
        });
      }
    } catch (error) {
      console.error("Error updating user details:", error);
      alert("Failed to update user details");
    }
  };

  return (
    <div className="collapse-content">
      {/* First Name and Last Name in one line */}
      <div className="flex flex-wrap gap-4 mb-4 text-primary-content">
        <InputField
          label="First Name"
          labelClassName={"text-primary-content"}
          type="text"
          placeholder="First Name"
          className="w-[400px]"
          value={firstName}
          onChange={firstNameChangeHandler}
          onBlur={firstNameMarkAsTouched}
          hasError={firstNameHasError}
          errorMessage="Please enter a valid first name"
        />

        <InputField
          label="Last Name"
          labelClassName={"text-primary-content"}
          type="text"
          placeholder="Last Name"
          className="w-[400px]"
          value={lastName}
          onChange={lastNameChangeHandler}
          onBlur={lastNameMarkAsTouched}
          hasError={lastNameHasError}
          errorMessage="Please enter a valid last name"
        />
      </div>

      {/* Email and Organisation in one line */}
      <div className="flex flex-wrap gap-4 mb-4 text-primary-content">
        <InputField
          label="Email Address"
          labelClassName={"text-primary-content"}
          type="email"
          placeholder="Email Address"
          className="w-[400px]"
          value={emailValue}
          onChange={emailChangeHandler}
          onBlur={emailMarkAsTouched}
          hasError={emailHasError}
          errorMessage="Please enter a valid email address"
        />

        <InputField
          label="Organisation/Company"
          labelClassName={"text-primary-content"}
          type="text"
          placeholder="Organisation"
          className="w-[400px]"
          value={organisation}
          onChange={(e) => setOrganisation(e.target.value)}
        />
      </div>

      {/* Billing Address - First field full width, other two in one line */}
      <div className="flex flex-wrap gap-4 mb-4 text-primary-content">
        <InputField
          label="Street Address"
          labelClassName={"text-primary-content"}
          type="text"
          placeholder="Street Address"
          className="w-[400px]"
          value={streetAddress}
          onChange={(e) => setStreetAddress(e.target.value)}
        />

        <InputField
          label="City"
          labelClassName={"text-primary-content"}
          type="text"
          placeholder="City"
          className="w-full"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <InputField
          label="Postcode"
          labelClassName={"text-primary-content"}
          type="text"
          placeholder="Postcode"
          className="w-[100px]"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
        />
      </div>

      {/* Payment Method - Card Number, Expiry Date, CVV */}
      <div className="flex flex-wrap gap-4 mb-4 text-primary-content">
        <InputField
          label="Card Number"
          labelClassName={"text-primary-content"}
          type="text"
          placeholder="XXXX XXXX XXXX XXXX"
          className="w-[400px]"
          value={cardNumber}
          onChange={cardNumberChangeHandler}
          onBlur={cardNumberMarkAsTouched}
          hasError={cardNumberHasError}
          errorMessage="Please enter a valid card number, Card number should be 16 digits"
          icon="card-icon"
        />

        <div className="sm:w-1/4">
          <InputField
            label="Expiry Date"
            labelClassName={"text-primary-content"}
            ariaLabel={"Expiry Date"}
            type="date"
            className="sm:w-full"
            value={expiryDate}
            onChange={expiryDateChangeHandler}
            onBlur={expiryDateMarkAsTouched}
            hasError={expiryDateHasError}
            errorMessage="Expiry date should be in the future"
          />
        </div>
        <div className="w-full sm:w-1/4">
          <InputField
            label="CVV"
            labelClassName={"text-primary-content"}
            type="text"
            placeholder="CVV"
            className="w-[100px]"
            value={cvv}
            onChange={cvvChangeHandler}
            onBlur={cvvMarkAsTouched}
            hasError={cvvHasError}
            errorMessage="Please enter a three-digit CVV"
          />
        </div>
      </div>

      {/* Button to change billing information */}
      {/* Button is disabled if data is not changed and fields have any errors */}
      <div className="form-control mt-6">
        <ButtonMediumWide
          textColor={"text-primary-content -auto inline-block"}
          className="w-auto inline-block"
          disabled={
            !isChanged ||
            firstNameHasError ||
            lastNameHasError ||
            emailHasError ||
            cardNumberHasError ||
            cvvHasError ||
            expiryDateHasError
          }
          onClick={handleUpdate}
        >
          Change Billing Information
        </ButtonMediumWide>
      </div>
      {/* Error and success messages */}
      {error && <div className="pt-3 text-error">{error}</div>}
      {success && <div className="pt-3 text-success">{success}</div>}
    </div>
  );
};

export default BillingInformation;
