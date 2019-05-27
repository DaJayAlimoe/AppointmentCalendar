<template>
  <div id="app">
    <v-app id="inspire">
      <v-content>
        <router-view
          :user="user"
          @authenticated="setUser"
          @logout="logout"
          @notify="notify"
        />
        <v-snackbar
          v-model="snackbar.state"
          :color="snackbar.type"
          :bottom="true"
          :left="true"
          :timeout="snackbar.timeout"
        >
          {{ snackbar.text }}
          <v-btn dark flat @click="snackbar.state = false">Close</v-btn>
        </v-snackbar>
      </v-content>
    </v-app>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      snackbar: {
        state: false,
        type: "info",
        timeout: 1500,
        text: ""
      },
      authenticated: false,
      user: {
        name: null,
        color: null
      }
    };
  },
  mounted() {
    if (!this.authenticated) {
      this.$router.replace({ name: "login" });
    }
  },
  methods: {
    setUser(user) {
      let o = Math.round;
      let r = Math.random;
      let s = 255;
      if (user.authenticated) {
        this.authenticated = user.authenticated;
        this.user.name = user.name;
        this.user.color =
          "rgba(" +
          o(r() * s) +
          "," +
          o(r() * s) +
          "," +
          o(r() * s) +
          "," +
          1 +
          ")";
        this.notify({ type: "success", text: "Login Successful" });
        this.$router.replace({ name: "home" });
      } else {
        this.notify({ type: "error", text: "Login Failed" });
      }
    },
    logout() {
      this.notify({ type: "success", text: "Logout Successful" });
      this.authenticated = false;
      this.user.name = null;
    },
    notify(snackbar) {
      this.snackbar.type = snackbar.type ? snackbar.type : this.snackbar.type;
      this.snackbar.timeout = snackbar.timeout
        ? snackbar.timeout
        : this.snackbar.timeout;
      this.snackbar.text = snackbar.text ? snackbar.text : this.snackbar.text;
      this.snackbar.state = true;
    }
  }
};
</script>
