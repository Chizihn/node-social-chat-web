import { AxiosError } from "axios";

export function axiosErrorHandler(error: unknown, message?: string): string {
  let errorMessage = message || "An unknown error occurred";

  // Handling AxiosError
  if (error instanceof AxiosError) {
    // Handle the response error
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      console.error("Axios error response:", error.response);

      // Customize error messages based on status code
      switch (status) {
        case 400:
          errorMessage = data?.message || "Bad Request";
          break;
        case 401:
          errorMessage = "Unauthorized. Please log in.";
          break;
        case 403:
          errorMessage = "Forbidden. You do not have permission.";
          break;
        case 404:
          errorMessage = "Not found.";
          break;
        case 500:
          errorMessage = "Internal server error.";
          break;
        case 502:
          errorMessage = "Bad Gateway.";
          break;
        case 503:
          errorMessage = "Service Unavailable.";
          break;
        default:
          errorMessage = data?.message || `Error: ${status}`;
      }
    }
    // Handle request errors
    else if (error.request) {
      console.error("Axios error request:", error.request);
      errorMessage =
        "No response from server. Please check your network connection.";
    }
    // Handle other Axios-related errors
    else {
      console.error("Axios error message:", error.message);
      errorMessage = error.message || "An unknown error occurred with Axios.";
    }
  }
  // Handle other errors that are not Axios-related
  else if (error instanceof Error) {
    console.error("General error:", error.message);
    errorMessage = error.message || "An unknown error occurred.";
  }

  return errorMessage;
}
