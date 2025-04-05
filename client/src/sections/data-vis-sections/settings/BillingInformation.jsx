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
import { kAPI_URL } from '../../../api/utils/constants';

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
      const response = await fetch(`${kAPI_URL}/users/update`, {
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
      This the section that the user can configure their research project information.
    </div>
  );
};

export default BillingInformation;
