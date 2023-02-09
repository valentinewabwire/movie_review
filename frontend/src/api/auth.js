import client from "./client";

/**
 * It creates a user.
 * @param userInfo - {
 * @returns The data object from the response.
 */
export const createUser = async (userInfo) => {
  try {
    const { data } = await client.post("/user/create", userInfo);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) return response.data;

    return error.message || error;
  }
};

/**
 * It sends a POST request to the server with the user's email and password, and returns the response
 * from the server
 * @param userInfo - {
 * @returns The response from the server.
 */
export const verifyUserEmail = async (userInfo) => {
  try {
    const { data } = await client.post("/user/verify-email", userInfo);
    return data;
  } catch (error) {
    console.log(error.response?.data);
    const { response } = error;
    if (response?.data) return response.data;

    return error.message || error;
  }
};

/**
 * It sends a POST request to the server with the user's email and password, and returns the response
 * data
 * @param userInfo - {
 * @returns The data object from the response.
 */
export const signInUser = async (userInfo) => {
  try {
    const { data } = await client.post("/user/sign-in", userInfo);
    return data;
  } catch (error) {
    console.log(error.response?.data);
    const { response } = error;
    if (response?.data) return response.data;

    return error.message || error;
  }
};

/**
 * getIsAuth sends a GET request to the server with the token in the header, and returns the response data
 * @param token - the token that is stored in the local storage
 * @returns {
 *   "message": "Unauthenticated."
 * }
 */
export const getIsAuth = async (token) => {
  try {
    const { data } = await client.get("/user/is-auth", {
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
    });
    return data;
  } catch (error) {
    console.log(error.response?.data);
    const { response } = error;
    if (response?.data) return response.data;

    return error.message || error;
  }
};

/**
 * forgetPassword sends a POST request to the server with the email address of the user who wants to reset their
 * password
 * @param email - string
 * @returns The data object from the response.
 */
export const forgetPassword = async (email) => {
  try {
    const { data } = await client.post("/user/forget-password", { email });
    return data;
  } catch (error) {
    console.log(error.response?.data);
    const { response } = error;
    if (response?.data) return response.data;

    return error.message || error;
  }
};

/**
 * verifyPasswordResetToken takes a token and a userId and sends a POST request to the server to verify the token
 * @param token - The token that was sent to the user's email
 * @param userId - The user's id
 * @returns The response from the server.
 */
export const verifyPasswordResetToken = async (token, userId) => {
  try {
    const { data } = await client.post("/user/verify-pass-reset-token", {
      token,
      userId,
    });
    return data;
  } catch (error) {
    console.log(error.response?.data);
    const { response } = error;
    if (response?.data) return response.data;

    return error.message || error;
  }
};

/**
 * It takes in a passwordInfo object, sends it to the server, and returns the response
 * @param passwordInfo - {
 * @returns The data from the response.
 */
export const resetPassword = async (passwordInfo) => {
  try {
    const { data } = await client.post("/user/reset-password", passwordInfo);
    return data;
  } catch (error) {
    console.log(error.response?.data);
    const { response } = error;
    if (response?.data) return response.data;

    return error.message || error;
  }
};
