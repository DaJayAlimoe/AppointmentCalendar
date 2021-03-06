<template>
  <v-container fluid grid-list-xl>
    <v-container fluid grid-list-xl>
      <v-layout row justify-space-between>
        <v-flex sm4 xs12 class="text-sm-left text-xs-center">
          <v-btn
            id="create_appointment"
            small
            color="primary"
            @click.stop="createMeeting()"
            >Create</v-btn
          >
          <MeetingAssistant />
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
                <v-icon :color="user.color" x-large v-on="on"
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
          <Calendar ref="calendar" :user="user" />
        </v-flex>

        <v-dialog v-model="notification.dialog" max-width="290">
          <v-card v-if="notification.event !== null">
            <v-card-title class="headline">Meeting Details</v-card-title>

            <v-card-text>{{
              "Title: " + notification.event.title
            }}</v-card-text>
            <v-card-text>{{ "Date: " + notification.event.date }}</v-card-text>
            <v-card-text>{{ "Time: " + notification.event.time }}</v-card-text>
            <v-card-text>{{
              "Duration: " + notification.event.duration + " minutes"
            }}</v-card-text>
            <v-card-text>{{
              "From : " + notification.event.owner
            }}</v-card-text>

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
import Calendar from "@/components/Calendar.vue";
import MeetingAssistant from "@/components/MeetingAssistant.vue";
import { mapState } from "vuex";
export default {
  name: "Home",
  components: {
    Calendar,
    MeetingAssistant
  },
  computed: mapState(["user", "notification", "meeting"]),
  methods: {
    logout() {
      this.$store.dispatch("user/logout");
    },
    showNotificationDetails(notification) {
      if ([1, 2, 4].includes(notification.notificationType)) {
        this.$store.dispatch("notification/removeNotification", notification);
      } else {
        this.$store.dispatch(
          "notification/showNotificationEvent",
          notification
        );
      }
    },
    closenotificationDialog(agreed) {
      if (agreed) {
        this.$store.dispatch("notification/acceptNotificationEvent");
      } else {
        this.$store.dispatch("notification/declineNotificationEvent");
      }
    },
    createMeeting() {
      if (!this.meeting.visible) {
        this.$store.dispatch("meeting/toggleVisibility", true);
      }
    }
  }
};
</script>
<style lang="scss" scoped></style>
