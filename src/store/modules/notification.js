import NotificationService from "@/services/NotificationService.js";
import MeetingService from "@/services/MeetingService.js";
export default {
  namespaced: true,
  state: {
    dialog: false,
    selected_notification: {},
    event: {},
    notifications: []
  },
  getters: {
    dialog: state => {
      return state.dialog;
    },
    selected_notification: state => {
      return state.selected_notification;
    },
    event: state => {
      return state.event;
    },
    notifications: state => {
      return state.notifications;
    }
  },
  mutations: {
    SET_NOTIFICATION_DIALOG(state, dialog) {
      state.dialog = dialog;
    },
    SET_SELECTED_NOTIFICATION(state, notification) {
      state.selected_notification = notification;
    },
    SET_NOTIFICATION_EVENT(state, event) {
      state.event = event;
    },
    SET_NOTIFICATIONS(state, notifications) {
      state.notifications = notifications;
    }
  },
  actions: {
    fetchNotifications({ commit, dispatch, rootGetters }) {
      NotificationService.getUserNotifications(rootGetters["user/name"])
        .then(response => {
          if (response.data) {
            let notifications = response.data.map(notification => {
              let data = {
                ...notification,
                ...{
                  message: ""
                }
              };
              switch (notification.notificationType) {
                case 0:
                  data.message = `${
                    notification.notificationSender
                  } invited you to a meeting`;
                  break;

                case 1:
                  data.message = `${
                    notification.notificationSender
                  } accepted your meeting invitation`;
                  break;

                case 2:
                  data.message = `${
                    notification.notificationSender
                  } declined your meeting invitation`;
                  break;

                case 3:
                  data.message = `${
                    notification.notificationSender
                  } made changes to a meeting you are attending`;
                  break;

                case 4:
                  data.message = `${
                    notification.notificationSender
                  } deleted a meeting`;
                  break;

                default:
                  data.message = "";
                  break;
              }
              return data;
            });
            commit("SET_NOTIFICATIONS", notifications);
          }
        })
        .catch(error => {
          dispatch(
            "alert/add",
            { type: "error", message: error.message },
            { root: true }
          );
        });
    },
    removeNotification({ commit, getters, dispatch }, notification) {
      if (notification.notificationID !== null) {
        NotificationService.deleteNotification(notification.notificationID)
          .then(response => {
            if (response.data) {
              let notifications = getters.notifications.filter(element => {
                return element.notificationID !== notification.notificationID;
              });
              commit("SET_NOTIFICATIONS", notifications);
            }
          })
          .catch(error => {
            dispatch(
              "alert/add",
              { type: "error", message: error.message },
              { root: true }
            );
          });
      }
    },
    showNotificationEvent({ commit, dispatch }, notification) {
      MeetingService.getEvent(notification.meetingID)
        .then(response => {
          if (response.data) {
            commit("SET_NOTIFICATION_EVENT", response.data);
            commit("SET_SELECTED_NOTIFICATION", notification);
            commit("SET_NOTIFICATION_DIALOG", true);
          }
        })
        .catch(error => {
          dispatch(
            "alert/add",
            { type: "error", message: error.message },
            { root: true }
          );
        });
    },
    hideNotificationEvent({ commit }) {
      commit("SET_NOTIFICATION_EVENT", {});
      commit("SET_SELECTED_NOTIFICATION", {});
      commit("SET_NOTIFICATION_DIALOG", false);
    },
    acceptNotificationEvent({ getters, dispatch, rootGetters }) {
      MeetingService.acceptMeeting(
        getters.selected_notification.meetingID,
        rootGetters["user/name"]
      )
        .then(response => {
          if (response.data) {
            dispatch("removeNotification", getters.selected_notification);
            dispatch("hideNotificationEvent");
            dispatch("meeting/removeUserEvents", rootGetters["user/name"], {
              root: true
            });
            dispatch("meeting/fetchUserEvents", rootGetters["user/name"], {
              root: true
            });
            dispatch(
              "alert/add",
              { type: "success", message: "Meeting Invitation accepted!" },
              { root: true }
            );
          } else {
            dispatch(
              "alert/add",
              {
                type: "error",
                message: "Meeting Invitation couldn't be accepted!"
              },
              { root: true }
            );
          }
        })
        .catch(error => {
          dispatch(
            "alert/add",
            { type: "error", message: error.message },
            { root: true }
          );
        });
    },
    declineNotificationEvent({ getters, dispatch, rootGetters }) {
      MeetingService.declineMeeting(
        getters.selected_notification.meetingID,
        rootGetters["user/name"]
      )
        .then(response => {
          if (response.data) {
            dispatch("removeNotification", getters.selected_notification);
            dispatch("hideNotificationEvent");
            dispatch(
              "alert/add",
              { type: "success", message: "Meeting Invitation declined!" },
              { root: true }
            );
          } else {
            dispatch(
              "alert/add",
              {
                type: "error",
                message: "Meeting Invitation couldn't be declined! Try again!"
              },
              { root: true }
            );
          }
        })
        .catch(error => {
          dispatch(
            "alert/add",
            { type: "error", message: error.message },
            { root: true }
          );
        });
    }
  }
};
