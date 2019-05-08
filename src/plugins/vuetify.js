import Vue from "vue";
import Vuetify from "vuetify/lib";
import "vuetify/src/stylus/app.styl";

Vue.use(Vuetify, {
  theme: {
    primary: "#00bcd4",
    secondary: "#607d8b",
    accent: "#3f51b5",
    error: "#ff5722",
    warning: "#ffc107",
    info: "#03a9f4",
    success: "#4caf50"
  },
  iconfont: "md"
});
