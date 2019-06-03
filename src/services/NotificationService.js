import axios from "axios";

const apiClient = axios.create({
  baseURL: `http://localhost:8084`,
  withCredentials: false, // This is the default
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export default {
  getUserNotifications(username) {
    return apiClient.get(`/notification/${username}`);
  },
  deleteNotification(id) {
    return apiClient.get(`/notification/${id}`);
  }
};
