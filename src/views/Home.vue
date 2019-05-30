<template>
  <v-container fluid grid-list-xl>
    <v-container fluid grid-list-xl>
      <v-layout row justify-space-between>
        <v-flex sm4 xs12 class="text-sm-left text-xs-center">
          <v-btn
            id="create_appointment"
            small
            color="primary"
            @click.stop="dialog = true"
            >Create</v-btn
          >
          <MeetingAssistant
            :visible="dialog"
            @close="dialog = false"
            :user="this.user"
            @notify="notify"
          />
        </v-flex>
        <v-spacer></v-spacer>
        <v-flex sm4 xs12 class="text-sm-right text-xs-center">
          <v-menu
            offset-y
            content-class="dropdown-menu"
            transition="slide-y-transition"
          >
            <template v-slot:activator="{ on }">
              <v-badge color="primary" right overlap>
                <template v-if="hasNotifications()" v-slot:badge>
                  <span>{{ getNotificationsCount() }}</span>
                </template>
                <span>{{ user.name }}</span>
                <v-icon :color="getUserColor()" x-large v-on="on"
                  >account_circle</v-icon
                >
              </v-badge>
            </template>
            <v-card>
              <v-list dense>
                <v-list-tile
                  v-for="(notification, index) in notifications"
                  :key="index"
                >
                  <v-list-tile-title v-text="notification" />
                </v-list-tile>
                <v-list-tile color="secondary" @click="logout">
                  <v-list-tile-title>
                    <v-flex xs12>
                      <b>Logout</b>
                      <v-icon color="grey">user_logout</v-icon>
                    </v-flex>
                  </v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-menu>
        </v-flex>
      </v-layout>
      <v-spacer></v-spacer>
      <v-layout align-center justify-space-around row>
        <v-flex xs12>
          <Calendar :user="this.user" @notify="notify" />
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
import Calendar from "@/components/Calendar.vue";
import MeetingAssistant from "@/components/MeetingAssistant.vue";
import NotificationService from "@/services/NotificationService.js";
export default {
  name: "Home",
  props: ["user"],
  data() {
    return {
      dialog: false,
      notifications: [
        "Mike, John responded to your email",
        "You have 5 new tasks",
        "You're now a friend with Andrew",
        "Another Notification",
        "Another One"
      ],
      timer: null
    };
  },
  created: function() {
    this.timer = setInterval(this.fetchNotifications(), 600000);
  },
  components: {
    Calendar,
    MeetingAssistant
  },
  methods: {
    logout() {
      this.$emit("logout");
      this.$router.replace({ name: "login" });
    },
    notify(notification) {
      this.$emit("notify", notification);
    },
    getUserColor() {
      return this.user !== null ? this.user.color : "grey lighten-1";
    },
    hasNotifications() {
      return this.notifications.length >= 1;
    },
    getNotificationsCount() {
      return this.notifications.length;
    },
    fetchNotifications() {
      NotificationService.getUserNotifications(this.user.name)
        .then(response => {
          if (response.data) {
            this.notifications = response.data;
          }
        })
        .catch(error => {
          this.$emit("notify", {
            type: "error",
            text: error.message
          });
        });
    },
    cancelAutoUpdate: function() {
      clearInterval(this.timer);
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>
<style lang="scss" scoped></style>
