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
    getAuthenticated: state => {
      return state.authenticated;
    },
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
      UserService.login(getters.name, password).then(response => {
        if (response.data) {
          commit("LOGIN", {
            auth: response.data,
            name: getters.name,
            color: getRandomRGBA()
          });
          dispatch("meeting/fetchUserEvents", getters.name, { root: true });
          dispatch("fetchUsers");
          dispatch("resource/fetchResources", null, { root: true });
          dispatch(
            "alert/add",
            {
              type: "success",
              message: "Login Successful"
            },
            { root: true }
          );
        } else {
          dispatch(
            "alert/add",
            {
              type: "error",
              message: "Invalid Credentials try again!"
            },
            { root: true }
          );
        }
      });
    },
    logout({ commit, dispatch }) {
      commit("LOGOUT");
      dispatch("meeting/resetEvents", null, { root: true });
      dispatch("resetUsers");
      dispatch("resource/resetResources", null, { root: true });
      dispatch(
        "alert/add",
        {
          type: "success",
          message: "Logout Successful"
        },
        { root: true }
      );
    },
    fetchUsers({ commit, getters, dispatch }) {
      UserService.getUsers(getters.name)
        .then(response => {
          if (response.data) {
            let users = response.data.map(user => {
              return {
                ...{ name: user },
                ...{ color: getRandomRGBA(), selected: false }
              };
            });
            commit("SET_USERS", users);
          }
        })
        .catch(error => {
          dispatch(
            "alert/add",
            {
              type: "error",
              message: error.message
            },
            { root: true }
          );
        });
    },
    resetUsers({ commit }) {
      commit("SET_USERS", []);
    },
    selectUser({ commit, getters, dispatch }, { name, value }) {
      let key = getters.users.findIndex(user => {
        return user.name === name;
      });
      commit("SET_USER_SELECTED", { key: key, selected: value });
      if (value) {
        dispatch("meeting/fetchUserEvents", name, { root: true });
      } else {
        dispatch("meeting/removeUserEvents", name, { root: true });
      }
      // for (const key in getters.users) {
      //   if (getters.users.hasOwnProperty(key)) {
      //     const element = getters.users[key];
      //     if (element.name === name) {
      //       commit("SET_USER_SELECTED", { key: key, selected: value });
      //       break;
      //     }
      //   }
      // }
    },
    resetSelectedUsers({ getters, dispatch }) {
      let selectedUsers = getters.users.filter(user => user.selected);
      selectedUsers.forEach(user => {
        if (user.selected === true) {
          dispatch("selectUser", { name: user.name, value: user.selected });
        }
      });
    }
  }
};
