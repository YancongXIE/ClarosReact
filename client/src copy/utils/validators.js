export const checkValidEmailFormat = (email) => {
  const trimmedEmail = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
};

export const checkValidPasswordFormat = (password) => {
  const trimmedPassword = password.trim();
  return /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/.test(
    trimmedPassword
  );
};

export const checkValidNameFormat = (name) => {
  const trimmedName = name.trim();
  return /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(trimmedName);
}

export const checkValidCardNumber = (cardNumber) => {
  const trimmedCardNumber = cardNumber.trim();
  return /^[0-9]{16}$/.test(trimmedCardNumber);
}

export const checkValidCVV = (cvv) => {
  const trimmedCVV = cvv.trim();
  return /^[0-9]{3}$/.test(trimmedCVV);
}

export const checkExpiryDate = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  return expiry >= today;
};
