<template>
  <div id="app">
    <v-app id="inspire">
      <v-content>
        <router-view @notify="notify" />
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
import { mapState } from "vuex";
export default {
  name: "App",
  data() {
    return {
      snackbar: {
        state: false,
        type: "info",
        timeout: 2000,
        text: ""
      }
    };
  },
  computed: {
    ...mapState(["user"])
  },
  mounted() {
    if (!this.user.authenticated) {
      this.$router.replace({ name: "login" });
    }
  },
  methods: {
    notify(snackbar) {
      this.snackbar.type = snackbar.type ? snackbar.type : this.snackbar.type;
      if (this.snackbar.type === "info" && snackbar.timeout === undefined) {
        this.snackbar.timeout = 3000;
      } else {
        this.snackbar.timeout = snackbar.timeout
          ? snackbar.timeout
          : this.snackbar.timeout;
      }
      this.snackbar.text = snackbar.text ? snackbar.text : this.snackbar.text;
      this.snackbar.state = true;
    }
  }
};
</script>
