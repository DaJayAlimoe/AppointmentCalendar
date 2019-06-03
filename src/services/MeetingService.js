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
  },
  getEvent(id) {
    return apiClient.get(`/meeting/id/${id}`);
    // return apiClient.get("/appointment?name=" + username + "&password=" + password);
  },
  createMeeting(meeting) {
    return apiClient.post(`/meeting/`, meeting);
  },
  getResourceEvents(resource, date) {
    return apiClient.get(`/meeting/res/${resource}/${date}`);
    // return apiClient.get("/appointment?name=" + username + "&password=" + password);
  },
  acceptMeeting(meetingID, username) {
    return apiClient.put(`/meeting/${meetingID}/${username}/yes`);
  },
  declineMeeting(meetingID, username) {
    return apiClient.put(`/meeting/${meetingID}/${username}/no`);
  }
};
