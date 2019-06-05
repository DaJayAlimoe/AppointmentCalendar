function trim(str) {
  return str.replace(/^\s+|\s+$/gm, "");
}
function getRandomRGBA() {
  let rgba = "";
  let o = Math.round;
  let r = Math.random;
  let s = 255;
  rgba =
    "rgba(" + o(r() * s) + "," + o(r() * s) + "," + o(r() * s) + "," + 1 + ")";
  return rgba;
}
function getHEX(rgba) {
  let hex = "";
  let parts = rgba.substring(rgba.indexOf("(")).split(","),
    r = parseInt(trim(parts[0].substring(1)), 10),
    g = parseInt(trim(parts[1]), 10),
    b = parseInt(trim(parts[2]), 10),
    a = parseFloat(trim(parts[3].substring(0, parts[3].length - 1))).toFixed(2);
  hex = (
    "#" +
    r.toString(16) +
    g.toString(16) +
    b.toString(16) +
    (a * 255).toString(16)
  ).substring(0, 7);
  return hex;
}

import UserService from "@/services/UserService.js";
export default {
  state: {
    authenticated: false,
    name: null,
    rgba_color: null,
    hex_color: null,
    users: []
  },
  getters: {
    name: state => {
      return state.name;
    },
    rgbaColor: state => {
      return state.rgba_color;
    },
    hexColor: state => {
      return state.hex_color;
    },
    users: state => {
      return state.users;
    },
    getUserByName: state => name => {
      return state.users.find(user => user.name === name);
    }
  },
  mutations: {
    LOGIN(state, { auth, name, rgba, hex }) {
      state.authenticated = auth;
      state.name = name;
      state.rgba_color = rgba;
      state.hex_color = hex;
    },
    LOGOUT(state) {
      state.authenticated = false;
      state.name = null;
      state.rgba_color = null;
      state.hex_color = null;
    },
    SET_USERS(state, users) {
      state.users = users;
    },
    SET_USER_SELECTED(state, { key, selected }) {
      state.users[key]["selected"] = selected;
    }
  },
  actions: {
    login({ commit }, { username, password }) {
      return UserService.login(username, password)
        .then(response => {
          if (response.data) {
            let rgba = getRandomRGBA();
            let hex = getHEX(rgba);
            commit("LOGIN", {
              auth: response.data,
              name: username,
              rgba: rgba,
              hex: hex
            });
            return true;
          } else {
            // this.$emit("notify", {
            //   type: "error",
            //   text: "Invalid Credentials try again!"
            // });
            return false;
          }
        })
        .catch(error => {
          error;
          // this.$emit("notify", {
          //   type: "error",
          //   text: error.message
          // });
        });
    },
    logout({ commit }) {
      commit("LOGOUT");
    },
    fetchUsers({ commit, getters }) {
      UserService.getUsers(getters.name)
        .then(response => {
          if (response.data) {
            let users = [];
            let index = 0;
            response.data.forEach(user => {
              let rgba = this.getRandomRGBA();
              users[index] = user;
              users[index]["rgba_color"] = rgba;
              users[index]["hex_color"] = this.getHEX(rgba);
              users[index]["selected"] = false;
              index++;
            });
            commit("SET_USERS", users);
          } else {
            // this.$emit("notify", {
            //   type: "error",
            //   text: "No Users Found!"
            // });
          }
        })
        .catch(error => {
          error;
          // this.$emit("notify", {
          //   type: "error",
          //   text: error.message
          // });
        });
    },
    selectUser({ commit, getters }, { name }) {
      let index = getters.users.findIndex(user => user.name === name);
      commit("SET_USER_SELECTED", { key: index, selected: true });
    },
    resetSelectedUsers({ commit, getters }) {
      getters.users.forEach((user, index) => {
        if (user.selected === true)
          commit("SET_USER_SELECTED", { key: index, selected: false });
      });
    }
  }
};
