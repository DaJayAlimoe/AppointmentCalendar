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
                  <v-btn flat color="primary" @click="menu = false"
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
              />
            </v-flex>
          </v-layout>
        </v-container>
        <v-divider></v-divider>
        <!-- <v-list three-line subheader>
          <v-subheader>General</v-subheader>
          <v-list-tile avatar>
            <v-list-tile-action>
              <v-checkbox v-model="notifications"></v-checkbox>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Notifications</v-list-tile-title>
              <v-list-tile-sub-title>
                Notify me about updates to apps or games that I downloaded
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-action>
              <v-checkbox v-model="sound"></v-checkbox>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Sound</v-list-tile-title>
              <v-list-tile-sub-title>
                Auto-update apps at any time. Data charges may apply
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-action>
              <v-checkbox v-model="widgets"></v-checkbox>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Auto-add widgets</v-list-tile-title>
              <v-list-tile-sub-title
                >Automatically add home screen widgets</v-list-tile-sub-title
              >
            </v-list-tile-content>
          </v-list-tile>
        </v-list>-->
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  props: ["visible"],
  data() {
    return {
      date: new Date().toISOString().substring(0, 10),
      date_menu: false,
      time: null,
      time_menu: false,
      duration: null
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
  }
};
</script>