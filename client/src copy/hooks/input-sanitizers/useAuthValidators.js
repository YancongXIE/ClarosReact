import useInput from "../useInput";
import {
  checkValidEmailFormat,
  checkValidPasswordFormat,
  checkValidNameFormat,
  checkValidCardNumber,
  checkValidCVV,
  checkExpiryDate,
} from "../../utils/validators";

export function useEmailValidator() {
  return useInput(checkValidEmailFormat);
}

export function usePasswordValidator() {
  return useInput((password) => {
    if (password === "") {
      return true; // No error if the field is empty
    }
    return checkValidPasswordFormat(password);
  });
}

export function useNameValidator() {
  return useInput(checkValidNameFormat);
}

export function useCardNumberValidator() {
  return useInput(checkValidCardNumber);
}

export function useCVVValidator() {
  return useInput(checkValidCVV);
}

export function useExpiryDateValidator() {
  return useInput(checkExpiryDate);
}

