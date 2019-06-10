function getRandomRGBA() {
  let rgba = "";
  let o = Math.round;
  let r = Math.random;
  let s = 255;
  rgba =
    "rgba(" + o(r() * s) + "," + o(r() * s) + "," + o(r() * s) + "," + 1 + ")";
  return rgba;
}

import UserService from "@/services/UserService.js";
export default {
  namespaced: true,
  state: {
    authenticated: false,
    name: null,
    color: null,
    users: []
  },
  getters: {
    name: state => {
      return state.name;
    },
    color: state => {
      return state.color;
    },
    users: state => {
      return state.users;
    },
    getUserByName: state => name => {
      return state.users.find(user => user.name === name);
    },
    getSelectedUsers: state => {
      return state.users.filter(user => user.selected);
    }
  },
  mutations: {
    LOGIN(state, { auth, name, color }) {
      state.authenticated = auth;
      state.name = name;
      state.color = color;
    },
    LOGOUT(state) {
      state.authenticated = false;
      state.name = null;
      state.color = null;
    },
    SET_USERS(state, users) {
      state.users = users;
    },
    SET_USER_SELECTED(state, { key, selected }) {
      state.users[key].selected = selected;
    }
  },
  actions: {
    login({ commit, getters, dispatch }, password) {
      return UserService.login(getters.name, password).then(response => {
        if (response.data) {
          let rgba = getRandomRGBA();
          commit("LOGIN", {
            auth: response.data,
            name: getters.name,
            color: rgba
          });
          dispatch("meeting/fetchUserEvents", getters.name, { root: true });
        }
        return response.data;
      });
    },
    logout({ commit }) {
      commit("LOGOUT");
    },
    fetchUsers({ commit, getters }) {
      return UserService.getUsers(getters.name).then(response => {
        if (response.data) {
          let users = [];
          let index = 0;
          response.data.forEach(user => {
            let rgba = getRandomRGBA();
            users[index] = {
              ...{ name: user },
              ...{ color: rgba, selected: false }
            };
            index++;
          });
          commit("SET_USERS", users);
        }
      });
    },
    resetUsers({ commit }) {
      commit("SET_USERS", []);
    },
    selectUser({ commit, getters }, { name, value }) {
      for (const key in getters.users) {
        if (getters.users.hasOwnProperty(key)) {
          const element = getters.users[key];
          if (element.name === name) {
            commit("SET_USER_SELECTED", { key: key, selected: value });
            break;
          }
        }
      }
    },
    resetSelectedUsers({ commit, getters }) {
      getters.users.forEach((user, index) => {
        if (user.selected === true)
          commit("SET_USER_SELECTED", { key: index, selected: false });
      });
    }
  }
};
