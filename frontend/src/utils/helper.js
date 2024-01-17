/**
 * It returns true if the email address is valid, and false if it's not.
 * @param email - The email address to validate.
 * @returns The function isValidEmail is being returned.
 */
export const isValidEmail = (email) => {
  const isValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return isValid.test(email);
};

export const getToken = () => localStorage.getItem("auth-token");

export const catchError = (error) => {
  const { response } = error;
  if (response?.data) return response.data;

  return error.message || error;
};

/**
 * The `renderItem` function returns a JSX element that displays an image and a name.
 * @returns The function `renderItem` is returning a JSX element.
 */
export const renderItem = (result) => {
  return (
    <div key={result.id} className="flex space-x-2 rounded overflow-hidden">
      <img
        src={result.avatar}
        alt={result.name}
        className="w-16 h-16 object-cover"
      />
      <p className="dark:text-white font-semibold">{result.name}</p>
    </div>
  );
};
