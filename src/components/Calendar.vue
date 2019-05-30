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
                v-html="getEventTitle(event)"
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
                v-html="getEventTitle(event)"
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
import EventBus from "@/event-bus.js";
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
  created() {
    EventBus.$on("eventCreated", () => {
      this.removeCalUser(this.user.name);
      this.addCalUser(this.user.name, this.user.color);
    });
  },
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
      if (event.owner === this.user.name) {
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
      } else {
        alert(
          "----------EVENT DETAILS----------" +
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
      }
    },
    addCalUser(username, color) {
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
      let rgba = this.userColor[username];
      var parts = rgba.substring(rgba.indexOf("(")).split(","),
        r = parseInt(this.trim(parts[0].substring(1)), 10),
        g = parseInt(this.trim(parts[1]), 10),
        b = parseInt(this.trim(parts[2]), 10),
        a = parseFloat(
          this.trim(parts[3].substring(0, parts[3].length - 1))
        ).toFixed(2);

      return (
        "#" +
        r.toString(16) +
        g.toString(16) +
        b.toString(16) +
        (a * 255).toString(16)
      ).substring(0, 7);
    },
    trim(str) {
      return str.replace(/^\s+|\s+$/gm, "");
    },
    getEventTitle(event) {
      return event.for === this.user.name ? event.title : "";
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
