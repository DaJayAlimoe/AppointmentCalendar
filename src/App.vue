<template>
  <div id="app">
    <v-app id="inspire">
      <v-content>
        <router-view />
        <Alert v-for="alert in alert.alerts" :key="alert.id" :alert="alert" />
      </v-content>
    </v-app>
  </div>
</template>

<script>
import Alert from "@/components/Alert.vue";
import { mapState } from "vuex";
import { setTimeout, clearTimeout } from "timers";

export default {
  name: "App",
  components: { Alert },
  data() {
    return {
      notificationTimer: null
    };
  },
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
        this.fetchNotifications();
      } else {
        this.$router.replace({ name: "login" });
        this.clearNotificationTimer();
      }
    }
  },
  methods: {
    fetchNotifications() {
      this.$store.dispatch("notification/fetchNotifications");
      this.clearNotificationTimer();
      this.notificationTimer = setTimeout(this.fetchNotifications, 30000);
    },
    clearNotificationTimer() {
      if (this.notificationTimer !== null) clearTimeout(this.notificationTimer);
    }
  },
  beforeDestroy() {
    this.clearNotificationTimer();
  }
};
</script>
