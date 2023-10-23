import { getAxiosInstance } from "./axiosConfigs";

class Api {
  // #axios // It's a class private property. Not used here due to browser compatibility issues.
  constructor(baseUrl) {
    // this.#axios=getAxiosInstance(baseUrl)
    this.axios = getAxiosInstance(baseUrl);
  }

  setAuthHeaders(username, password) {
    this.axios.defaults.auth = {
      username,
      password,
    };
  }

  setUserSecretAuthHeaders() {
    const userSecret = localStorage.getItem("usr_secret");

    this.axios.defaults.headers = { usr_secret: userSecret };
  }

  setApplicationJsonHeaders() {
    this.axios.defaults.headers = { "Content-Type": "application/json" };
  }

  setMultipartHeaders() {
    this.axios.defaults.headers = { "Content-Type": "multipart/form-data" };
  }

  post(endPoint, body, isMultipart, shallAddUserSecretHeader, config) {
    if (!isMultipart) {
      this.setApplicationJsonHeaders();
    }

    if (shallAddUserSecretHeader) {
      this.setUserSecretAuthHeaders();
    }

    return this.axios.post(endPoint, body, config);
  }

  get(endPoint) {
    return this.axios.get(endPoint);
  }

  patch(endPoint, body, isMultipart) {
    if (!isMultipart) {
      this.setApplicationJsonHeaders();
    }

    return this.axios.patch(endPoint, body);
  }

  put(endPoint, body, isMultipart, shallAddUserSecretHeader) {
    if (!isMultipart) {
      this.setApplicationJsonHeaders();
    }

    if (shallAddUserSecretHeader) {
      this.setUserSecretAuthHeaders();
    }

    return this.axios.put(endPoint, body);
  }

  delete(endPoint) {
    return this.axios.delete(endPoint);
  }
}

const rxOneApi = new Api(process.env.REACT_APP_RX_ONE);
const rxOpdApi = new Api(process.env.REACT_APP_RX_OPD);

export { rxOneApi, rxOpdApi };
