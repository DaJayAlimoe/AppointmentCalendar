<template>
  <v-layout row justify-center>
    <v-dialog
      v-model="show"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          scroll-off-screen
          scroll-target="#scrolling-techniques"
          dense
          dark
          color="primary"
        >
          <v-btn icon dark @click.stop="show = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>
            Meeting Assistant
            <v-avatar size="22px" :color="user.hex_color"></v-avatar>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              v-if="meeting.id !== 0"
              dark
              flat
              @click="deleteEvent(meeting.id)"
              >Delete</v-btn
            >
            <v-btn dark flat @click.stop="saveEvent()">Save</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <div
          id="scrolling-techniques"
          class="scroll-y"
          style="max-height: 780px;"
        >
          <v-container style="height: 1000px;" grid-list-md text-xs-center>
            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field
                  v-model="meeting.title"
                  type="text"
                  label="Event Title"
                  :rules="[meeting.rules.required]"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs4>
                <v-menu
                  ref="menu1"
                  v-model="meeting.date_menu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="meeting.date"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="meeting.date"
                      label="Date"
                      readonly
                      :rules="[meeting.rules.required]"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="meeting.date"
                    scrollable
                    :landscape="true"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      flat
                      color="primary"
                      @click="
                        this.$store.dispatch('toggleDateMenuVisibility', false)
                      "
                      >Cancel</v-btn
                    >
                    <v-btn
                      flat
                      color="primary"
                      @click="$refs.menu1.save(meeting.date)"
                      >OK</v-btn
                    >
                  </v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs4>
                <v-menu
                  ref="menu2"
                  v-model="meeting.time_menu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="meeting.time"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="meeting.time"
                      label="Start Time"
                      :rules="[meeting.rules.required]"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    format="24hr"
                    v-model="meeting.time"
                    full-width
                    @click:minute="$refs.menu2.save(meeting.time)"
                  ></v-time-picker>
                </v-menu>
              </v-flex>
              <v-flex xs4>
                <v-text-field
                  v-model="meeting.duration"
                  label="Duration"
                  suffix="hours"
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="24"
                  required
                  :rules="[meeting.rules.daylimit]"
                />
              </v-flex>
            </v-layout>

            <v-divider></v-divider>

            <v-layout row wrap>
              <v-flex xs11 left>
                <v-subheader>Invitations</v-subheader>
              </v-flex>
              <v-flex xs1>
                <v-subheader>Users</v-subheader>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs10 left>
                <v-card>
                  <Calendar
                    :user="user"
                    ref="sharedCalendar"
                    @notify="notify"
                  />
                </v-card>
              </v-flex>
              <v-flex xs2>
                <v-list two-line subheader>
                  <v-list-tile
                    avatar
                    v-for="user in user.users"
                    :key="user.name"
                  >
                    <v-list-tile-action>
                      <v-switch
                        :id="user.name"
                        v-model="user.selected"
                        :color="user.rgba_color"
                        @change="inviteUser(user)"
                      ></v-switch>
                    </v-list-tile-action>

                    <v-list-tile-content>
                      <v-list-tile-title>{{ user.name }}</v-list-tile-title>
                      <!-- <v-list-tile-sub-title>
                      {{ user.department }}
                      </v-list-tile-sub-title>-->
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-flex>
            </v-layout>

            <v-divider></v-divider>

            <v-layout row wrap>
              <v-flex xs10 left>
                <v-subheader>Resources</v-subheader>
              </v-flex>
              <v-flex xs1>
                <v-btn @click="removeResource()">
                  <v-icon>delete</v-icon>
                </v-btn>
              </v-flex>
              <v-flex xs1>
                <v-btn color="secondary" @click="addResource()">Add</v-btn>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <template v-for="(resource, index) in calResources">
                <component
                  :id="index"
                  :resources="resourceNames"
                  :date="date"
                  :is="resource"
                  :key="resource.name"
                  @notify="notify"
                  @selectChange="resourceSelected"
                ></component>
              </template>
            </v-layout>

            <v-divider></v-divider>
          </v-container>
        </div>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import EventBus from "@/event-bus.js";
import Calendar from "@/components/Calendar.vue";
import Resource from "@/components/Resource.vue";
import { mapState } from "vuex";
import UserService from "@/services/UserService.js";
import ResourceService from "@/services/ResourceService.js";
import MeetingService from "@/services/MeetingService.js";
export default {
  props: ["visible", "user"],
  components: {
    Resource,
    Calendar
  },
  data() {
    return {
      id: 0,
      title: null,
      date: null,
      date_menu: false,
      time: null,
      time_menu: false,
      duration: null,
      rules: {
        daylimit: value =>
          value <= 24 || "Duration cannot be longer than 24 hours",
        required: value => value != null || "Field cannot be empty"
      },
      attendees: [],
      users: [],
      resourceNames: [],
      resources: [],
      selectedResources: {}
    };
  },
  mounted() {
    UserService.getUsers(this.user.name)
      .then(response => {
        if (response.data) {
          this.users = response.data;
        } else {
          this.$emit("notify", {
            type: "error",
            text: "No Users Found!"
          });
        }
      })
      .catch(error => {
        this.$emit("notify", {
          type: "error",
          text: error.message
        });
      });
    ResourceService.getResources()
      .then(response => {
        if (response.data) {
          this.resourceNames = response.data;
        } else {
          this.$emit("notify", {
            type: "error",
            text: "No Resources Found!"
          });
        }
      })
      .catch(error => {
        this.$emit("notify", {
          type: "error",
          text: error.message
        });
      });
    EventBus.$on("eventToEdit", event => {
      console.log(event);
      this.id = event.id;
      this.title = event.title;
      this.date = event.date;
      this.time = event.time;
      this.duration = event.duration / 60;
      // for (const key in event.attendees) {
      //   if (event.attendees.hasOwnProperty(key)) {
      //     const attendee = event.attendees[key];
      //     var userSwitch = document.getElementById(attendee.name);
      //     if ("createEvent" in document) {
      //       var evt = document.createEvent("HTMLEvents");
      //       evt.initEvent("change", false, true);
      //       userSwitch.dispatchEvent(evt);
      //     }
      //   }
      // }

      this.$emit("eventEditTriggered");
    });
  },
  computed: mapState(["user", "meeting"]),
  // {
  //   show: {
  //     get() {
  //       return this.visible;
  //     },
  //     set(value) {
  //       if (!value) {
  //         this.$emit("close");
  //       }
  //     }
  //   },
  //   calendarUsers() {
  //     let userMap = [];
  //     let o = Math.round;
  //     let r = Math.random;
  //     let s = 255;
  //     for (const key in this.users) {
  //       if (this.users.hasOwnProperty(key)) {
  //         userMap[key] = {};
  //         userMap[key]["name"] = this.users[key];
  //         userMap[key]["color"] =
  //           "rgba(" +
  //           o(r() * s) +
  //           "," +
  //           o(r() * s) +
  //           "," +
  //           o(r() * s) +
  //           "," +
  //           1 +
  //           ")";
  //         userMap[key]["selected"] = false;
  //       }
  //     }
  //     return userMap;
  //   },
  //   calResources() {
  //     return this.resources;
  //   }
  // },
  methods: {
    resourceSelected(resourceData) {
      this.selectedResources[resourceData.id] = resourceData.selected;
    },
    notify(notification) {
      this.$emit("notify", notification);
    },
    addResource(name) {
      this.resources.push(Resource);
      this.$emit("invitation", name);
    },
    removeResource() {
      this.resources.splice(this.resources.length - 1, 1);
      if (this.selectedResources[this.resources.length - 1]) {
        delete this.selectedResources[this.resources.length - 1];
      }
    },
    inviteUser(user) {
      if (user.selected) {
        this.$refs.sharedCalendar.addCalUser(user.name, user.color);
        this.attendees.push(user.name);
      } else {
        this.$refs.sharedCalendar.removeCalUser(user.name);
        this.attendees.splice(this.attendees.indexOf(user.name), 1);
      }
    },
    saveEvent() {
      let eventObject = {
        id: this.id,
        title: this.title,
        date: this.date,
        time: this.time,
        duration: this.duration * 60,
        owner: this.user.name,
        attendees: [],
        ressourcen: []
      };
      this.attendees.forEach((attendee, index) => {
        eventObject.attendees[index] = { name: attendee, status: 0 };
      });
      Object.keys(this.selectedResources).forEach(id => {
        eventObject.ressourcen[id] = this.selectedResources[id];
      });
      MeetingService.createMeeting(eventObject)
        .then(response => {
          if (response.data) {
            this.$emit("notify", {
              type: "success",
              text: "Meeting succesfully saved!"
            });
            this.show = false;
            this.id = 0;
            this.title = null;
            this.date = null;
            this.time = null;
            this.duration = null;
            this.selectedResources = {};
            this.attendees = [];

            EventBus.$emit("eventCreated");
          } else {
            this.$emit("notify", {
              type: "error",
              text: "Could not save Meeting. Try again!"
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
    deleteEvent(id) {
      MeetingService.deleteMeeting(id)
        .then(response => {
          if (response.data) {
            this.$emit("eventDeleted");
            this.$emit("notify", {
              type: "success",
              text: "Meeting successfully Deleted!"
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
  }
};
</script>
