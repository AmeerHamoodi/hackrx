import axios, { AxiosError } from "axios";

export function handleHttpError(error: AxiosError | Error) {
  if (!axios.isAxiosError(error)) return "Something went wrong!";

  const status = error.response?.status;
  const response = error.response as any;

  switch (status) {
    // Validation error
    case 422:
      if (!response?.data.message) return response?.data.error as string;

      if (!Array.isArray(response?.data.message)) return response?.data.message as string;

      const errorsInternal = Object.values(response?.data.message).flat() as string[];
      return errorsInternal;
    // Authentication
    case 401:
      return response?.data.message ? response?.data.message : response?.data.error;
    // Authorization
    case 403:
      return "You are do not have permission to access this resource!";
    // Not found
    case 404:
      return "We can't seem to find what you're looking for!";
    default:
      return "Something went wrong!";
  }
}
