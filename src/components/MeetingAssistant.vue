<template>
  <v-layout row justify-center>
    <v-dialog
      v-model="show"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click.stop="show = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Meeting Assistant</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click.stop="show = false">Save</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container grid-list-md text-xs-center>
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field label="Event Title" required></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs4>
              <v-menu
                ref="menu1"
                v-model="date_menu"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="date"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="date"
                    label="Date"
                    readonly
                    required
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date" scrollable :landscape="true">
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="date_menu = false"
                    >Cancel</v-btn
                  >
                  <v-btn flat color="primary" @click="$refs.menu1.save(date)"
                    >OK</v-btn
                  >
                </v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs4>
              <v-menu
                ref="menu2"
                v-model="time_menu"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="time"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="time"
                    label="Start Time"
                    required
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  format="24hr"
                  v-model="time"
                  full-width
                  @click:minute="$refs.menu2.save(time)"
                ></v-time-picker>
              </v-menu>
            </v-flex>
            <v-flex xs4>
              <v-text-field
                v-model="duration"
                label="Duration"
                suffix="hours"
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                required
                :rules="[rules.daylimit]"
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
                <Calendar :user="this.user" ref="sharedCalendar" />
              </v-card>
            </v-flex>
            <v-flex xs2>
              <v-list two-line subheader>
                <v-list-tile
                  avatar
                  v-for="user in calendarUsers"
                  :key="user.name"
                >
                  <v-list-tile-action>
                    <v-switch
                      v-model="user.selected"
                      :color="user.color"
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
            <template v-for="resource in calResources">
              <component
                :resources="resourceNames"
                :date="date"
                :is="resource"
                :key="resource.name"
              ></component>
            </template>
          </v-layout>

          <v-divider></v-divider>
        </v-container>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import Calendar from "@/components/Calendar.vue";
import Resource from "@/components/Resource.vue";
import UserService from "@/services/UserService.js";
import ResourceService from "@/services/ResourceService.js";
export default {
  props: ["visible", "user"],
  components: {
    Resource,
    Calendar
  },
  data() {
    return {
      date: null,
      date_menu: false,
      time: null,
      time_menu: false,
      duration: null,
      rules: {
        daylimit: value =>
          value <= 24 || "Duration cannot be longer than 24 hours"
      },
      users: [],
      resources: [],
      resourceNames: []
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
        console.log(response.data);
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
  },
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit("close");
        }
      }
    },
    calendarUsers() {
      let colors = ["pink", "amber", "indigo", "blue", "purple", "red"];
      let userMap = [];
      for (const key in this.users) {
        if (this.users.hasOwnProperty(key)) {
          userMap[key] = {};
          userMap[key]["name"] = this.users[key];
          userMap[key]["color"] = colors[key];
          userMap[key]["selected"] = false;
        }
      }
      return userMap;
    },
    calResources() {
      return this.resources;
    }
  },
  methods: {
    addResource(name) {
      this.resources.push(Resource);
      this.$emit("invitation", name);
    },
    removeResource() {
      this.resources.splice(this.resources.length - 1, 1);
    },
    inviteUser(user) {
      if (user.selected) {
        this.$refs.sharedCalendar.addCalUser(user.name, user.color);
      } else {
        this.$refs.sharedCalendar.removeCalUser(user.name);
      }
    }
  }
};
</script>
