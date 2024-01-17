import { catchError, getToken } from "../utils/helper";
import client from "./client";

/**
 * This function uploads a movie trailer using a form data object and returns the response data or an
 * error message.
 * @param formData - formData is an object that contains the data to be uploaded, typically in the form
 * of a file or files. It is used as the second parameter in the client.post() method call. The data is
 * sent as a multipart/form-data request.
 * @returns The function `uploadTrailer` returns the `data` object if the request is successful, or the
 * error message or response data if the request fails.
 */
export const uploadTrailer = async (formData, onUploadProgress) => {
  const token = getToken();
  try {
    const { data } = await client.post("/movie/upload-trailer", formData, {
      headers: {
        authorization: "Bearer " + token,
        "content-type": "multipart/form-data",
      },
      /* The `onUploadProgress` property is an optional parameter in the `client.post()` method call that
allows for tracking the progress of the file upload. It is a function that takes an object with two
properties, `loaded` and `total`, which represent the number of bytes that have been uploaded and
the total number of bytes to be uploaded, respectively. */
      onUploadProgress: ({ loaded, total }) => {
        if (onUploadProgress)
          onUploadProgress(Math.floor((loaded / total) * 100));
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};
