import { useState } from "react";

export default function useInput(validateValue) {
  const [enteredValue, setEnteredValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  // touched = if input field has been interacted with/clicked in

  const isValid = validateValue(enteredValue);
  const hasError = !isValid && isTouched;

  //Update enteredValue object with user's input:
  const valueChangeHandler = (e) => {
    setEnteredValue(e.target.value);
    setIsTouched(true); // Trigger validation on every change
  };

  //Set input to 'touched' (interacted with)
  const markAsTouched = () => {
    setIsTouched(true);
  };

  // Reset input fields after invalid or successful input has been submitted
  const inputReset = () => {
    setEnteredValue("");
    setIsTouched(false);
  };

  const setValue = (value) => {
    setEnteredValue(value);
  };

  return {
    value: enteredValue,
    hasError,
    valueChangeHandler,
    markAsTouched,
    inputReset,
    setValue,
  };
}
