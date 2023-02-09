/**
 * It returns true if the email address is valid, and false if it's not.
 * @param email - The email address to validate.
 * @returns The function isValidEmail is being returned.
 */
export const isValidEmail = (email) => {
  const isValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return isValid.test(email);
};
