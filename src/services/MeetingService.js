import axios from "axios";

const apiClient = axios.create({
  baseURL: `http://localhost:8082`,
  withCredentials: false, // This is the default
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export default {
  getUserEvents(username) {
    return apiClient.get(`/meeting/${username}`);
    // return apiClient.get("/appointment?name=" + username + "&password=" + password);
  }
};
