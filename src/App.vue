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
        timeout: 3000,
        text: "No Info"
      },
      authenticated: false,
      user: {
        id: null,
        name: null
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
      if (user.authenticated) {
        this.authenticated = user.authenticated;
        this.user.id = user.id;
        this.user.name = user.name;
        this.notify({ type: "success", text: "Login successful" });
        this.$router.replace({ name: "home" });
      } else {
        this.notify({ type: "error", text: "Login failed" });
      }
    },
    logout() {
      this.notify({ type: "success", text: "Logout successful" });
      this.authenticated = false;
      this.user.id = null;
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
