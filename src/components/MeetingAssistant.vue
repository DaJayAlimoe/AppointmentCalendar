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
            <v-flex xs10 left>
              <v-subheader>Invitations</v-subheader>
            </v-flex>
            <v-flex xs1>
              <v-btn @click="removeAttendee()">
                <v-icon>delete</v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs1>
              <v-btn color="secondary" @click="addAttendee()">Add</v-btn>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <template v-for="attendee in attendees">
              <component
                :is="attendee"
                :key="attendee.name"
                :user="this.user"
              ></component>
            </template>
          </v-layout>

          <v-divider></v-divider>

          <v-layout row wrap>
            <v-flex xs10 left>
              <v-subheader>Resources</v-subheader>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-spacer></v-spacer>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import Attendee from "@/components/Attendee.vue";
export default {
  props: ["visible", "user"],
  components: {
    Attendee
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
      attendees: []
    };
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
    }
  },
  methods: {
    addAttendee() {
      this.attendees.push(Attendee);
    },
    removeAttendee() {
      this.attendees.splice(this.attendees.length - 1, 1);
    }
  }
};
</script>
