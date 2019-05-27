<template>
  <v-layout wrap>
    <v-flex xs12 class="mb-3">
      <v-sheet height="500">
        <v-calendar ref="calendar" v-model="today" type="week" color="primary">
          <!-- the events at the top (all-day) -->
          <template v-slot:dayHeader="{ date }">
            <template v-for="event in eventsMap[date]">
              <!-- all day events don't have time -->
              <div
                v-if="!event.time"
                :key="event.title"
                class="my-event"
                :style="{ backgroundColor: getuserColor(event.for) }"
                @click="open(event)"
                v-html="event.title"
              ></div>
            </template>
          </template>
          <!-- the events at the bottom (timed) -->
          <template v-slot:dayBody="{ date, timeToY, minutesToPixels }">
            <template v-for="event in eventsMap[date]">
              <!-- timed events -->
              <div
                v-if="event.time"
                :key="event.title"
                :style="{
                  top: timeToY(event.time) + 'px',
                  height: minutesToPixels(event.duration) + 'px',
                  backgroundColor: getuserColor(event.for)
                }"
                class="my-event with-time"
                @click="open(event)"
                v-html="event.title"
              ></div>
            </template>
          </template>
        </v-calendar>
      </v-sheet>
    </v-flex>
    <v-layout row justify-space-between>
      <v-flex sm4 xs12 class="text-sm-left text-xs-center">
        <v-btn @click="$refs.calendar.prev()">
          <v-icon dark left>keyboard_arrow_left</v-icon>Prev
        </v-btn>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex sm4 xs12 class="text-sm-right text-xs-center">
        <v-btn @click="$refs.calendar.next()">
          Next
          <v-icon right dark>keyboard_arrow_right</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script>
import MeetingService from "@/services/MeetingService.js";
export default {
  name: "Calendar",
  props: ["user"],
  data: () => ({
    today:
      new Date().getFullYear() +
      "-" +
      (new Date().getMonth() + 1) +
      "-" +
      new Date().getDate(),
    events: [],
    userColor: {}
  }),
  computed: {
    // convert the list of events into a map of lists keyed by date
    eventsMap() {
      const map = {};
      for (const key in this.events) {
        if (this.events.hasOwnProperty(key)) {
          if (!Array.isArray(map[this.events[key].date])) {
            map[this.events[key].date] = [];
          }
          map[this.events[key].date].push(this.events[key]);
        }
      }
      return map;
    }
  },
  mounted() {
    this.addCalUser(this.user.name, this.user.color);
    this.$refs.calendar.scrollToTime("08:00");
  },
  methods: {
    open(event) {
      console.log(event);
      alert(
        "----------EVENT DETAILS----------\nTitle: " +
          event.title +
          "\nDate: " +
          event.date +
          "\nTime: " +
          event.time +
          "\nDuration: " +
          event.duration +
          " minutes" +
          "\nUser : " +
          event.for
      );
    },
    addCalUser(username, color) {
      console.log("adding user: " + username);
      console.log("adding user color: " + color);
      this.userColor[username] = color;
      MeetingService.getUserEvents(username)
        .then(response => {
          if (response.data) {
            for (const key in response.data) {
              if (response.data.hasOwnProperty(key)) {
                let eventData = response.data[key];
                eventData["for"] = username;
                this.events.push(eventData);
              }
            }
          } else {
            this.$emit("notify", {
              type: "info",
              text: `No events found for user ${username}`
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
    removeCalUser(username) {
      console.log("removing user: " + username);
      console.log("removing user color: " + this.userColor[username]);
      let newEvents = [];
      delete this.userColor[username];
      for (const key in this.events) {
        if (this.events.hasOwnProperty(key)) {
          if (this.events[key]["for"] != username) {
            newEvents[key] = this.events[key];
          }
        }
      }
      this.events = newEvents;
    },
    getuserColor(username) {
      let rgb = this.userColor[username];
      let found = rgb.match(/.*?(\d+),.*?(\d+),.*?(\d+).*?\)/);
      let r = found[1].toString(16);
      let g = found[2].toString(16);
      let b = found[3].toString(16);

      if (r.length == 1) r = "0" + r;
      if (g.length == 1) g = "0" + g;
      if (b.length == 1) b = "0" + b;

      return "#" + r + g + b;
    }
  }
};
</script>

<style lang="stylus" scoped>
.my-event {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 2px;
  color: #ffffff;
  border: 1px solid #1867c0;
  font-size: 12px;
  padding: 3px;
  cursor: pointer;
  margin-bottom: 1px;
  left: 4px;
  margin-right: 8px;
  position: relative;

  &.with-time {
    position: absolute;
    right: 4px;
    margin-right: 0px;
  }
}
</style>
