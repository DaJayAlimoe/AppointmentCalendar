import Vue from "vue";
import Vuex from "vuex";
import user from "@/store/modules/user.js";
import alert from "@/store/modules/alert.js";
import notification from "@/store/modules/notification.js";
import meeting from "@/store/modules/meeting.js";
import resource from "@/store/modules/resource.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    alert,
    notification,
    meeting,
    resource
  }
});
