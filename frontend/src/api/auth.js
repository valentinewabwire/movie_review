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
