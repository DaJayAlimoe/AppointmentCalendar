import Vue from "vue";
import Vuex from "vuex";
import user from "@/store/modules/user.js";
import notification from "@/store/modules/notification.js";
import meeting from "@/store/modules/meeting.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    notification,
    meeting
  }
});
