import axios from "axios";  // Import axios for making API requests.
import { BASE_URL } from "./constants"  // Import the base URL for the API requests.

const axiosInstance = axios.create({
    baseURL: BASE_URL,  // Set the base URL for the API requests.
    timeout: 10000,  // Set the request timeout to 10 seconds.
    headers: {
        "Content-Type": "application/json",  // Set the content type for the requests.
    },
});

axiosInstance.interceptors.request.use(// Add an interceptor to attach the authorization token to the request headers.
    (config) => {
        const accessToken= localStorage.getItem("token");  // Get the token from local storage.
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;  // Set the authorization header with the token.
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);// Add an interceptor to attach the authorization token to the request headers.

export default axiosInstance;  //
