import MeetingService from "@/services/MeetingService.js";
import ResourceService from "@/services/ResourceService.js";
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
    resources: [],
    rules: {
      daylimit: value =>
        value <= 24 || "Duration cannot be longer than 24 hours",
      required: value => value != null || "Field cannot be empty"
    }
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
    resources: state => {
      return state.resources;
    },
    getResourceBySelected: state => selected => {
      return state.resources.filter(resource => {
        resource.selected === selected;
      });
    },
    getResourceIndexByName: state => name => {
      return state.resources.findIndex(resource => resource.name === name);
    }
  },
  mutations: {
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
    SET_RESOURCES(state, resources) {
      state.resources = resources;
    },
    SET_RESOURCE_SELECTED(state, { key, selected }) {
      state.resources[key].selected = selected;
    },
    SET_VISIBLE(state, visible) {
      state.visible = visible;
    }
  },
  actions: {
    fetchResources({ commit }) {
      return ResourceService.getResources().then(response => {
        if (response.data) {
          let resources = response.data.map(resource => {
            return {
              ...resource,
              selected: false
            };
          });
          commit("SET_RESOURCES", resources);
        }
        return response.data;
      });
    },
    setMeeting({ commit, getters, dispatch }, meeting) {
      commit("SET_ID", meeting.id);
      commit("SET_TITLE", meeting.title);
      commit("SET_DATE", meeting.date);
      commit("SET_TIME", meeting.time);
      commit("SET_DURATION", meeting.duration / 60);
      meeting.attendees.forEach(attendee => {
        dispatch("user/selectUser", attendee.name);
      });
      meeting.resources.forEach(resource => {
        let index = getters.getResourceIndexByName(resource);
        commit("SET_RESOURCE_SELECTED", { key: index, selected: true });
      });
    },
    deleteMeeting({ commit, getters, dispatch }, id) {
      if (getters.id === id) {
        return MeetingService.deleteMeeting(id).then(response => {
          if (response.data) {
            commit("SET_VISIBLE", false);
            dispatch("resetMeeting");
          }
          return response.data;
        });
      }
    },
    saveMeeting({ commit, getters, rootGetters, dispatch }) {
      let meeting = {
        id: getters.id,
        title: getters.title,
        date: getters.date,
        time: getters.time,
        duration: getters.duration,
        attendees: rootGetters.getSelectedUsers.map(attendee => {
          return { name: attendee.name, status: 0 };
        }),
        ressourcen: getters.getSelectedResourceNames
      };
      MeetingService.createMeeting(meeting).then(response => {
        if (response.data) {
          commit("SET_VISIBLE", false);
          dispatch("resetMeeting");
        }
        return response.data;
      });
    },
    resetMeeting({ commit, getters, dispatch }) {
      commit("SET_ID", 0);
      commit("SET_TITLE", null);
      commit("SET_DATE", null);
      commit("SET_TIME", null);
      commit("SET_DURATION", null);
      dispatch("user/resetSelectedUsers");
      getters.resources.forEach(resource => {
        if (resource.selected) {
          let index = getters.getResourceIndexByName(resource.name);
          commit("SET_RESOURCES", { key: index, selected: false });
        }
      });
    },
    toggleVisibility({ commit }, visible) {
      commit("SET_VISIBLE", visible);
    },
    toggleDateMenuVisibility({ commit }, visible) {
      commit("SET_DATE_MENU", visible);
    },
    toggleTimeMenuVisibility({ commit }, visible) {
      commit("SET_TIME_MENU", visible);
    }
  }
};
