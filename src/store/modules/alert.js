let nextId = 1;

export default {
  namespaced: true,
  state: {
    arlets: []
  },
  mutations: {
    PUSH(state, alert) {
      state.arlets.push({ id: nextId++, ...alert });
    },
    DELETE(state, alertToRemove) {
      state.alerts = state.alerts.filter(
        alert => alert.id !== alertToRemove.id
      );
    }
  },
  actions: {
    add({ commit }, alert) {
      commit("PUSH", alert);
    },
    remove({ commit }, alert) {
      commit("DELETE", alert);
    }
  }
};
