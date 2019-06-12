<template>
  <v-layout row justify-center>
    <v-dialog
      v-model="meeting.visible"
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
          <v-btn icon dark @click.stop="reset()">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>
            Meeting Assistant
            <v-avatar size="22px" :color="user.color"></v-avatar>
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
            <v-btn dark flat @click.stop="save()">Save</v-btn>
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
                  :rules="[rules.required]"
                  @focus="magic_flag = true"
                  @blur="setTitle(meeting.title)"
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
                      :rules="[rules.required]"
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
                        this.$store.dispatch(
                          'meeting/toggleDateMenuVisibility',
                          false
                        )
                      "
                      >Cancel</v-btn
                    >
                    <v-btn flat color="primary" @click="setDate(meeting.date)"
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
                      :rules="[rules.required]"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    format="24hr"
                    v-model="meeting.time"
                    full-width
                    @click:minute="setTime(meeting.time)"
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
                  @blur="setDuration(meeting.duration)"
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
                    v-for="possibleAttendee in user.users"
                    :key="possibleAttendee.name"
                  >
                    <v-list-tile-action>
                      <v-switch
                        :id="possibleAttendee.name"
                        v-model="possibleAttendee.selected"
                        :color="possibleAttendee.color"
                        @change="inviteUser(possibleAttendee)"
                      ></v-switch>
                    </v-list-tile-action>

                    <v-list-tile-content>
                      <v-list-tile-title>{{
                        possibleAttendee.name
                      }}</v-list-tile-title>
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
                <v-btn @click="removeResourceComponent()">
                  <v-icon>delete</v-icon>
                </v-btn>
              </v-flex>
              <v-flex xs1>
                <v-btn color="secondary" @click="addResourceComponent()"
                  >Add</v-btn
                >
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <template
                v-for="(resourceComponent, index) in resourceComponents"
              >
                <component
                  :is="resourceComponent"
                  :key="index"
                  :ref="'resource-' + index"
                  @notify="notify"
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
import Calendar from "@/components/Calendar.vue";
import Resource from "@/components/Resource.vue";
import { mapState } from "vuex";
export default {
  components: {
    Resource,
    Calendar
  },
  data() {
    return {
      resourceComponents: [],
      rules: {
        daylimit: value =>
          value <= 24 || "Duration cannot be longer than 24 hours",
        required: value => value != null || "Field cannot be empty"
      }
    };
  },
  mounted() {
    this.$store.watch(
      (state, getters) => getters.resources,
      (newValue, oldValue) => {
        console.log(`Updating from ${oldValue} to ${newValue}`);

        // Do whatever makes sense now
        if (newValue === "success") {
          this.complex = {
            deep: "some deep object"
          };
        }
      }
    );
  },
  computed: mapState(["user", "meeting", "resource"]),
  methods: {
    notify(notification) {
      this.$emit("notify", notification);
    },
    addResourceComponent() {
      this.resourceComponents.push(Resource);
    },
    removeResourceComponent() {
      if (this.resourceComponents.length) {
        let index = this.resourceComponents.length - 1;
        this.$refs[`resource-${index}`][0].destroy();
        this.resourceComponents.splice(index, 1);
        if (!this.resourceComponents.length) {
          this.resourceComponents = [];
        }
      }
    },
    setTitle(title) {
      this.$store.dispatch("meeting/setTitle", title);
    },
    setDate(date) {
      this.$refs.menu1.save(date);
      this.$store.dispatch("meeting/setDate", date);
      for (const key in this.resourceComponents) {
        if (this.resourceComponents.hasOwnProperty(key)) {
          this.$refs[`resource-${key}`][0].selectResource();
        }
      }
    },
    setTime(time) {
      this.$refs.menu2.save(time);
      this.$store.dispatch("meeting/setTime", time);
    },
    setDuration(duration) {
      this.$store.dispatch("meeting/setDuration", duration);
    },
    inviteUser(user) {
      this.$store.dispatch("user/selectUser", {
        name: user.name,
        value: user.selected
      });
      if (user.selected) {
        this.$store.dispatch("meeting/fetchUserEvents", user.name);
      } else {
        this.$store.dispatch("meeting/removeUserEvents", user.name);
      }
    },
    reset() {
      this.$store.dispatch("meeting/resetMeeting");
      this.$store.dispatch("user/resetSelectedUsers");
      this.$store.dispatch("meeting/toggleVisibility", false);
    },
    deleteEvent(id) {
      this.$store
        .dispatch("meeting/deleteMeeting", id)
        .then(response => {
          if (response) {
            this.$store.dispatch("meeting/removeUserEvents", this.user.name);
            this.$store.dispatch("meeting/fetchUserEvents", this.user.name);
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
    },
    save() {
      this.$store
        .dispatch("meeting/saveMeeting")
        .then(response => {
          if (response) {
            this.$emit("notify", {
              type: "success",
              text: "Meeting succesfully saved!"
            });
            this.$store.dispatch("meeting/resetMeeting");
            this.$store.dispatch("user/resetSelectedUsers");
            while (this.resourceComponents.length) {
              this.removeResourceComponent();
            }
            this.$store.dispatch("meeting/removeUserEvents", this.user.name);
            this.$store.dispatch("meeting/fetchUserEvents", this.user.name);
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
    }
  }
};
</script>
