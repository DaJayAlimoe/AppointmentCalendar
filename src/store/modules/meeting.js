import MeetingService from "@/services/MeetingService.js";
export default {
  namespaced: true,
  state: {
    visible: false,
    id: 0,
    owner: null,
    title: null,
    date: null,
    date_menu: false,
    time: null,
    time_menu: false,
    duration: null,
    events: []
  },
  getters: {
    visible: state => {
      return state.visible;
    },
    id: state => {
      return state.id;
    },
    owner: state => {
      return state.owner;
    },
    title: state => {
      return state.title;
    },
    date: state => {
      return state.date;
    },
    date_menu: state => {
      return state.date_menu;
    },
    time: state => {
      return state.time;
    },
    time_menu: state => {
      return state.time_menu;
    },
    duration: state => {
      return state.duration;
    },
    events: state => {
      return state.events;
    }
  },
  mutations: {
    SET_VISIBLE(state, visible) {
      state.visible = visible;
    },
    SET_ID(state, id) {
      state.id = id;
    },
    SET_OWNER(state, owner) {
      state.owner = owner;
    },
    SET_TITLE(state, title) {
      state.title = title;
    },
    SET_DATE(state, date) {
      state.date = date;
    },
    SET_DATE_MENU(state, date_menu) {
      state.date_menu = date_menu;
    },
    SET_TIME(state, time) {
      state.time = time;
    },
    SET_TIME_MENU(state, time_menu) {
      state.time_menu = time_menu;
    },
    SET_DURATION(state, duration) {
      state.duration = duration;
    },
    SET_EVENTS(state, events) {
      state.events = events;
    }
  },
  actions: {
    setMeeting({ commit }, meeting) {
      commit("SET_ID", meeting.id);
      commit("SET_TITLE", meeting.title);
      commit("SET_DATE", meeting.date);
      commit("SET_TIME", meeting.time);
      commit("SET_DURATION", meeting.duration / 60);
    },
    deleteMeeting({ commit, getters, dispatch, rootGetters }, id) {
      if (getters.id === id) {
        MeetingService.deleteMeeting(id)
          .then(response => {
            if (response.data) {
              commit("SET_VISIBLE", false);
              dispatch("resetMeeting");
              dispatch("meeting/removeUserEvents", rootGetters.user.name, {
                root: true
              });
              dispatch("meeting/fetchUserEvents", rootGetters.user.name, {
                root: true
              });
              dispatch(
                "alert/add",
                {
                  type: "success",
                  message: "Meeting successfully Deleted!"
                },
                {
                  root: true
                }
              );
            }
          })
          .catch(error => {
            dispatch(
              "alert/add",
              {
                type: "error",
                message: error.message
              },
              {
                root: true
              }
            );
          });
      }
    },
    saveMeeting({ commit, getters, dispatch, rootGetters }) {
      if (getters.title && getters.date && getters.time && getters.duration) {
        let meeting = {
          id: getters.id,
          title: getters.title,
          date: getters.date,
          time: getters.time,
          duration: parseFloat(getters.duration) * 60,
          owner: rootGetters["user/name"],
          attendees: rootGetters["user/getSelectedUsers"].map(attendee => {
            return { name: attendee.name, status: 0 };
          }),
          ressourcen: rootGetters["resource/selectedResources"].map(
            resource => {
              return resource.name;
            }
          )
        };
        MeetingService.createMeeting(meeting)
          .then(response => {
            if (response.data) {
              commit("SET_VISIBLE", false);
              dispatch(
                "alert/add",
                {
                  type: "success",
                  message: "Meeting successfully saved!"
                },
                {
                  root: true
                }
              );
              dispatch("resetMeeting");
              dispatch("user/resetSelectedUsers", null, { root: true });
              dispatch("removeUserEvents", this.user.name);
              dispatch("fetchUserEvents", this.user.name);
            } else {
              dispatch(
                "alert/add",
                {
                  type: "error",
                  message: "Could not save Meeting. Try again!"
                },
                {
                  root: true
                }
              );
            }
          })
          .catch(error => {
            dispatch(
              "alert/add",
              {
                type: "error",
                message: error.message
              },
              {
                root: true
              }
            );
          });
      } else {
        dispatch(
          "alert/add",
          {
            type: "error",
            message: "The title date, time and duration cannot be empty!"
          },
          {
            root: true
          }
        );
      }
    },
    resetMeeting({ commit /**rootGetters, dispatch */ }) {
      commit("SET_ID", 0);
      commit("SET_OWNER", "");
      commit("SET_TITLE", "");
      commit("SET_DATE", "");
      commit("SET_TIME", "");
      commit("SET_DURATION", "");
      // rootGetters["user/users"].forEach(user => {
      //   dispatch("removeUserEvents", user.name);
      // });
    },
    toggleVisibility({ commit }, visible) {
      commit("SET_VISIBLE", visible);
    },
    setTitle({ commit }, title) {
      commit("SET_TITLE", title);
    },
    setDate({ commit }, date) {
      commit("SET_DATE", date);
    },
    setTime({ commit }, time) {
      commit("SET_TIME", time);
    },
    setDuration({ commit }, duration) {
      commit("SET_DURATION", duration);
    },
    fetchUserEvents({ commit, getters, dispatch }, username) {
      MeetingService.getUserEvents(username)
        .then(response => {
          let newEvents = getters.events;
          if (response.data) {
            let mappedEvents = response.data.map(event => {
              return {
                ...event,
                ...{ for: username }
              };
            });
            newEvents.push(mappedEvents);
            // for (const key in response.data) {
            //   if (response.data.hasOwnProperty(key)) {
            //     let eventData = {
            //       ...response.data[key],
            //       ...{ for: username }
            //     };
            //     newEvents.push(eventData);
            //   }
            // }
            commit("SET_EVENTS", newEvents);
          }
        })
        .catch(error => {
          dispatch(
            "alert/add",
            {
              type: "error",
              message: error.message
            },
            {
              root: true
            }
          );
        });
    },
    removeUserEvents({ commit, getters }, username) {
      let newEvents = getters.events.filter(event => event.for !== username);
      commit("SET_EVENTS", newEvents);
    },
    resetEvents({ commit }) {
      commit("SET_EVENTS", []);
    }
  }
};
