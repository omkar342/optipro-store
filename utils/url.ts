import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// Define the base URL for the API
export const baseURL = "https://optipro-backend.onrender.com/";
// export const baseURL = "http://localhost:3002/";

// Create an Axios instance with the base URL
const Axios: AxiosInstance = axios.create({
  baseURL: baseURL,
});

// Define the request method types
type RequestMethod = 'get' | 'post' | 'put' | 'delete';

// Define the configuration object type for API requests
interface ApiRequestConfig {
  url: string;
  type: RequestMethod;
  data?: object;
  headers?: object;
}

// Define the API function with generic typing for the response
export const api = async <T = unknown>({
  url,
  type,
  data,
  headers,
}: ApiRequestConfig): Promise<AxiosResponse<T>> => {
  const requestTypes: RequestMethod[] = ['get', 'post', 'put', 'delete'];
  const requestType = requestTypes.find((reqType) => reqType === type);

  if (requestType) {
    try {
      const config: AxiosRequestConfig = {
        method: requestType,
        url: url,
        data: data,
        headers: headers,
      };
      const response: AxiosResponse<T> = await Axios(config);
      return response;
    } catch (e) {
      return Promise.reject(e);
    }
  } else {
    return Promise.reject("Invalid request type");
  }
};
