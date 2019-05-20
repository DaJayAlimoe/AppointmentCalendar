import axios from "axios";

const apiClient = axios.create({
  baseURL: `http://benutzerbob:8080/user`,
  withCredentials: false, // This is the default
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export default {
  login(username, password) {
    return apiClient.get("/login?name=" + username + "&password=" + password);
  }
};
