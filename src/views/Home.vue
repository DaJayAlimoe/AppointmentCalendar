<template>
  <v-container fluid grid-list-xl>
    <v-container fluid grid-list-xl>
      <v-layout row justify-space-between>
        <v-flex sm4 xs12 class="text-sm-left text-xs-center">
          <v-btn
            id="create_appointment"
            small
            color="primary"
            @click.stop="meetinAssistantDialog = true"
            >Create</v-btn
          >
          <MeetingAssistant
            :visible="meetinAssistantDialog"
            @eventEditTriggered="meetinAssistantDialog = true"
            @eventDeleted="deletedEvent"
            @close="meetinAssistantDialog = false"
            :user="user"
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
                <template
                  v-if="notification.notifications.length > 0"
                  v-slot:badge
                >
                  <span>{{ notification.notifications.length }}</span>
                </template>
                <span>{{ user.name }}</span>
                <v-icon :color="user.hex_color" x-large v-on="on"
                  >account_circle</v-icon
                >
              </v-badge>
            </template>
            <v-card>
              <v-list dense>
                <v-list-tile
                  v-for="notification in notification.notifications"
                  :key="notification.notificationID"
                >
                  <v-list-tile-title
                    @click="showNotificationDetails(notification)"
                    >{{ notification.message }}</v-list-tile-title
                  >
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
          <Calendar ref="calendar" :user="user" @notify="notify" />
        </v-flex>

        <v-dialog v-model="notification.dialog" max-width="290">
          <v-card v-if="notification.event !== null">
            <v-card-title class="headline">Meeting Details</v-card-title>

            <v-card-text>
              {{ "Title: " + notification.event.title }}
            </v-card-text>
            <v-card-text>{{ "Date: " + notification.event.date }}</v-card-text>
            <v-card-text>{{ "Time: " + notification.event.time }}</v-card-text>
            <v-card-text>
              {{ "Duration: " + notification.event.duration + " minutes" }}
            </v-card-text>
            <v-card-text>
              {{ "From : " + notification.event.owner }}
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                color="green darken-1"
                flat="flat"
                @click="closenotificationDialog(false)"
                >Decline</v-btn
              >

              <v-btn
                color="green darken-1"
                flat="flat"
                @click="closenotificationDialog(true)"
                >Accept</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
import EventBus from "@/event-bus.js";
import Calendar from "@/components/Calendar.vue";
import MeetingAssistant from "@/components/MeetingAssistant.vue";
import { mapState } from "vuex";
import NotificationService from "@/services/NotificationService.js";
export default {
  name: "Home",
  data() {
    return {
      notificationMeeting: null,
      meetinAssistantDialog: false,
      notifiocationDialog: false,
      notifications: [],
      notificationId: null,
      timer: null
    };
  },
  mounted() {
    EventBus.$on("eventToView", event => {
      this.notificationMeeting = event;
      this.notificationDialog = true;
    });
  },
  created: function() {
    this.$store.dispatch("fetchNotifications", 600000).catch(error => {
      this.$emit("notify", {
        type: "error",
        text: error.message
      });
    });
  },
  components: {
    Calendar,
    MeetingAssistant
  },
  computed: mapState(["user", "notification"]),
  methods: {
    logout() {
      this.$store
        .dispatch("logout")
        .then(() => {
          this.$router.replace({ name: "login" });
          this.notify({ type: "success", text: "Logout Successful" });
        })
        .catch(error => {
          this.$emit("notify", {
            type: "error",
            text: error.message
          });
        });
    },
    notify(notification) {
      this.$emit("notify", notification);
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
    },
    showNotificationDetails(notification) {
      if ([1, 2, 4].includes(notification.notificationType)) {
        this.$store
          .dispatch("removeNotification", notification)
          .catch(error => {
            this.$emit("notify", {
              type: "error",
              text: error.message
            });
          });
      } else {
        this.$store
          .dispatch("showNotificationEvent", notification)
          .catch(error => {
            this.$emit("notify", {
              type: "error",
              text: error.message
            });
          });
      }
    },
    closenotificationDialog(agreed) {
      let action = "declineNotificationEvent";
      let successText = "Meeting declined!";
      let errorText = "Meeting couldn't be declined! Try again";
      if (agreed) {
        action = "acceptNotificationEvent";
        successText = "Meeting accepted!";
        errorText = "Meeting couldn't be saved!";
      }
      this.$store
        .dispatch(action)
        .then(response => {
          if (response) {
            this.$refs.calendar.removeCalUser(this.user.name);
            this.$refs.calendar.addCalUser(
              this.user.name,
              this.user.rgba_color
            );
            this.$emit("notify", {
              type: "success",
              text: successText,
              timeout: 30000
            });
          } else {
            this.$emit("notify", {
              type: "error",
              text: errorText,
              timeout: 30000
            });
          }
        })
        .catch(error => {
          this.$emit("notify", {
            type: "error",
            text: error.message
          });
        });
    },
    deletedEvent() {
      this.meetinAssistantDialog = false;
      this.$refs.calendar.removeCalUser(this.user.name);
      this.$refs.calendar.addCalUser(this.user.name, this.user.color);
    },
    getNotificationMeetingText() {
      if (this.notificationMeeting) {
        return (
          "Title: " +
          this.notificationMeeting.title +
          "\nDate: " +
          this.notificationMeeting.date +
          "\nTime: " +
          this.notificationMeeting.time +
          "\nDuration: " +
          this.notificationMeeting.duration +
          " minutes" +
          "\nFrom : " +
          this.notificationMeeting.owner
        );
      } else {
        return "";
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>
<style lang="scss" scoped></style>
