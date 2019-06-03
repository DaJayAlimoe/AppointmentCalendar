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
            @close="meetinAssistantDialog = false"
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
                  v-for="(notification, index) in notoficationData"
                  :key="index"
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
          <Calendar :user="this.user" @notify="notify" />
        </v-flex>

        <v-dialog v-model="notifiocationDialog" max-width="290">
          <v-card v-if="this.notificationMeeting !== null">
            <v-card-title class="headline">Meeting Details</v-card-title>

            <v-card-text>
              {{ "Title: " + this.notificationMeeting.title }}
            </v-card-text>
            <v-card-text>{{
              "Date: " + this.notificationMeeting.date
            }}</v-card-text>
            <v-card-text>
              {{ "Time: " + this.notificationMeeting.time }}
            </v-card-text>
            <v-card-text>
              {{
                "Duration: " + this.notificationMeeting.duration + " minutes"
              }}
            </v-card-text>
            <v-card-text>
              {{ "From : " + this.notificationMeeting.owner }}
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                color="green darken-1"
                flat="flat"
                @click="closeNotifiocationDialog(false)"
                >Decline</v-btn
              >

              <v-btn
                color="green darken-1"
                flat="flat"
                @click="closeNotifiocationDialog(true)"
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
import NotificationService from "@/services/NotificationService.js";
import MeetingService from "@/services/MeetingService.js";
export default {
  name: "Home",
  props: ["user"],
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
  created: function() {
    this.timer = setInterval(this.fetchNotifications(), 600000);
  },
  components: {
    Calendar,
    MeetingAssistant
  },
  computed: {
    notoficationData() {
      return this.notifications.map(notification => {
        let data = {
          ...notification,
          ...{
            message: ""
          }
        };
        switch (notification.notificationType) {
          case 0:
            data.message = `${
              notification.notificationSender
            } invited you to a meeting`;
            break;

          case 1:
            data.message = `${
              notification.notificationSender
            } accepted your meeting invitation`;
            break;

          case 2:
            data.message = `${
              notification.notificationSender
            } declined your meeting invitation`;
            break;

          case 3:
            data.message = `${
              notification.notificationSender
            } made changes to a meeting you are attending`;
            break;

          case 4:
            data.message = `${
              notification.notificationSender
            } deleted a meeting`;
            break;

          default:
            data.message = "";
            break;
        }
        return data;
      });
    }
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
    },
    showNotificationDetails(notification) {
      if (
        1 === notification.notificationType ||
        2 === notification.notificationType ||
        4 === notification.notificationType
      ) {
        NotificationService.deleteNotification(notification.notificationID)
          .then(response => {
            if (response.data) {
              this.notifications = this.notifications.filter(element => {
                return element.notificationID !== notification.notificationID;
              });
            }
          })
          .catch(error => {
            this.$emit("notify", {
              type: "error",
              text: error.message
            });
          });
      } else {
        MeetingService.getEvent(notification.meetingID)
          .then(response => {
            if (response.data) {
              this.notificationMeeting = response.data;
              this.notificationId = notification.notificationID;
              this.notifiocationDialog = true;
            }
          })
          .catch(error => {
            this.$emit("notify", {
              type: "error",
              text: error.message
            });
          });
      }
    },
    closeNotifiocationDialog(agreed) {
      if (agreed) {
        MeetingService.acceptMeeting(
          this.notificationMeeting.id,
          this.user.name
        )
          .then(response => {
            if (response.data) {
              NotificationService.deleteNotification(this.notificationId)
                .then(response => {
                  if (response.data) {
                    this.notifications = this.notifications.filter(element => {
                      return element.notificationID !== this.notificationId;
                    });
                    this.$emit("notify", {
                      type: "success",
                      text: "Meeting accepted!",
                      timeout: 30000
                    });
                    this.notifiocationDialog = false;
                    this.notificationMeeting = null;
                    this.notificationId = null;
                  }
                })
                .catch(error => {
                  this.$emit("notify", {
                    type: "error",
                    text: error.message
                  });
                });
            } else {
              this.$emit("notify", {
                type: "error",
                text: "Meeting couldn't be saved!",
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
      } else {
        MeetingService.declineMeeting(
          this.notificationMeeting.id,
          this.user.name
        )
          .then(response => {
            if (response.data) {
              NotificationService.deleteNotification(this.notificationId)
                .then(response => {
                  if (response.data) {
                    this.notifications = this.notifications.filter(element => {
                      return element.notificationID !== this.notificationId;
                    });
                    this.$emit("notify", {
                      type: "success",
                      text: "Meeting declined!",
                      timeout: 30000
                    });
                    this.notifiocationDialog = false;
                    this.notificationMeeting = null;
                    this.notificationId = null;
                  }
                })
                .catch(error => {
                  this.$emit("notify", {
                    type: "error",
                    text: error.message
                  });
                });
            } else {
              this.$emit("notify", {
                type: "error",
                text: "Meeting couldn't be declined! Try again",
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
      }
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
