import axios from "axios";

const apiClient = axios.create({
  baseURL: `http://localhost:3000`,
  withCredentials: false, // This is the default
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export default {
  createAppointment(appointment) {
    return apiClient.post("/meeting", appointment);
    // return apiClient.get("/appointment?name=" + username + "&password=" + password);
  }
};
