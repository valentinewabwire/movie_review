import { catchError, getToken } from "../utils/helper";
import client from "./client";

/**
 * The `createActor` function sends a POST request to create a new actor using the provided form data,
 * including an authorization token in the headers.
 * @param formData - The `formData` parameter is an object that contains the data to be sent in the
 * request body. It is typically used for sending form data or files in a multipart/form-data format.
 * @returns the `data` object if the request is successful. If there is an error, it will return the
 * `response.data` if available, otherwise it will return the error message or error itself.
 */
export const createActor = async (formData) => {
  const token = getToken();
  try {
    const { data } = await client.post("/actor/create", formData, {
      headers: {
        authorization: "Bearer " + token,
        "content-type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

/**
 * The `searchActor` function is an asynchronous function that searches for actors based on a given
 * query using an API endpoint, and returns the data if successful or an error if unsuccessful.
 * @param query - The `query` parameter is a string that represents the name of the actor you want to
 * search for. It will be used to search for actors with matching names.
 * @returns the data received from the API call if it is successful. If there is an error, it is
 * returning the error caught by the `catchError` function.
 */
export const searchActor = async (query) => {
  const token = getToken();
  try {
    const { data } = await client(`/actor/search?name=${query}`, {
      headers: {
        authorization: "Bearer " + token,
        "content-type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    return catchError(error);
  }
};
