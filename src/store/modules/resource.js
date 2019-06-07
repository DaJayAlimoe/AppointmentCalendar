import ResourceService from "@/services/ResourceService.js";
import MeetingService from "@/services/MeetingService.js";
export default {
  namespaced: true,
  state: {
    resources: []
  },
  getters: {
    events: state => {
      return state.events;
    },
    resources: state => {
      return state.resources;
    },
    getResourceIndexByName: state => name => {
      return state.resources.findIndex(resource => resource.name === name);
    }
  },
  mutations: {
    SET_EVENTS(state, events) {
      state.events = events;
    },
    SET_RESOURCES(state, resources) {
      state.resources = resources;
    },
    SET_RESOURCE_SELECTED(state, { key, selected }) {
      state.resources[key].selected = selected;
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
    fetchResourceEvents({ commit, getters, rootGetters }, resourceName) {
      let index = getters.getResourceIndexByName(resourceName);
      commit("SET_RESOURCE_SELECTED", { key: index, selected: true });
      return MeetingService.getResourceEvents(
        resourceName,
        rootGetters["meeting/date"]
      );
    },
    selectResources({ commit, getters }, resources) {
      resources.forEach(resource => {
        let index = getters.getResourceIndexByName(resource);
        commit("SET_RESOURCE_SELECTED", { key: index, selected: true });
      });
    },
    deselectResource({ commit, getters }, resourceName) {
      let index = getters.getResourceIndexByName(resourceName);
      commit("SET_RESOURCE_SELECTED", { key: index, selected: false });
    },
    resetSelectedResources({ commit, getters }) {
      getters.resources.forEach(resource => {
        if (resource.selected) {
          let index = getters.getResourceIndexByName(resource.name);
          commit("SET_RESOURCES", { key: index, selected: false });
        }
      });
    }
  }
};
