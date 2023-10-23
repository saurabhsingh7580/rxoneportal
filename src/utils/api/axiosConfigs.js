import axios from "axios";

export const getAxiosInstance = baseUrl => {
  try {
    const axiosInstance = axios.create({
      baseURL: baseUrl,
      timeout: 400000,
    });

    axiosInstance.interceptors.response.use(
      response => response,
      error => {
        if (!error) {
          return Promise.reject({
            message: "Seems like you are not connected to the Internet.",
          });
        }

        if (!error.response) {
          return Promise.reject({
            message: "Request took too long to respond. Please try later.",
          });
        }

        if (error.response.status === 401) {
          return Promise.reject({ error: error.response.data, status: 401 });
        }

        return Promise.reject(error.response.data);
      }
    );

    return axiosInstance;
  } catch (error) {
    console.log("ERROR in Axios.js. Error:", error);
  }
};
