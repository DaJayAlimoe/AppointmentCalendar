<template>
  <div id="app">
    <v-app id="inspire">
      <v-content>
        <router-view @notify="notify" />
        <Alert v-for="alert in alert.alerts" :key="alert.id" :alert="alert" />
      </v-content>
    </v-app>
  </div>
</template>

<script>
import Alert from "@/components/Alert.vue";
import { mapState } from "vuex";

export default {
  name: "App",
  components: { Alert },
  computed: {
    ...mapState(["user", "alert"]),
    authenticated: function() {
      return this.user.authenticated;
    }
  },
  watch: {
    authenticated: function(newValue) {
      if (newValue) {
        this.$router.replace({ name: "home" });
      } else {
        this.$router.replace({ name: "login" });
      }
    }
  },
  methods: {
    notify(snackbar) {
      this.snackbar.type = snackbar.type ? snackbar.type : this.snackbar.type;
      if (this.snackbar.type === "info" && snackbar.timeout === undefined) {
        this.snackbar.timeout = 2000;
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
