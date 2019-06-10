<template>
  <v-layout wrap>
    <v-flex xs12 class="mb-3">
      <v-sheet height="500">
        <v-calendar ref="calendar" v-model="today" type="week" color="primary">
          <!-- the events at the top (all-day) -->
          <template v-slot:dayHeader="{ date }">
            <template v-for="(event, index) in eventsMap[date]">
              <!-- all day events don't have time -->
              <div
                v-if="!event.time"
                :key="index"
                class="my-event"
                :style="{ backgroundColor: getuserColor(event.for) }"
                @click="open(event)"
                v-html="getEventTitle(event)"
              ></div>
            </template>
          </template>
          <!-- the events at the bottom (timed) -->
          <template v-slot:dayBody="{ date, timeToY, minutesToPixels }">
            <template v-for="(event, index) in eventsMap[date]">
              <!-- timed events -->
              <div
                v-if="event.time"
                :key="index"
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
import { mapState } from "vuex";
export default {
  name: "Calendar",
  data: () => ({
    today:
      new Date().getFullYear() +
      "-" +
      (new Date().getMonth() + 1) +
      "-" +
      new Date().getDate()
  }),
  created() {},
  computed: {
    ...mapState(["user", "meeting", "resource"]),
    eventsMap() {
      const map = {};
      for (const key in this.meeting.events) {
        if (this.meeting.events.hasOwnProperty(key)) {
          if (!Array.isArray(map[this.meeting.events[key].date])) {
            map[this.meeting.events[key].date] = [];
          }
          map[this.meeting.events[key].date].push(this.meeting.events[key]);
        }
      }
      return map;
    }
  },
  mounted() {
    this.$refs.calendar.scrollToTime("08:00");
  },
  methods: {
    open(event) {
      if (event.owner === this.user.name) {
        this.$store.dispatch("meeting/toggleVisibility", true);
        this.$store.dispatch("meeting/setMeeting", event);
        if (typeof event.attendees !== "undefined") {
          event.attendees.forEach(attendee => {
            if (attendee.name !== this.user.name) {
              this.$store.dispatch("user/selectUser", {
                name: attendee.name,
                value: true
              });
              this.$store.dispatch("meeting/fetchUserEvents", attendee.name);
            }
          });
        }
        console.log(event.resources);
        if (typeof event.resources !== "undefined") {
          console.log(event.resources);
          this.$store.dispatch("resource/selectResources", event.resources);
        }
      } else {
        this.$store
          .dispatch("notification/showNotificationEvent", {
            meetingID: event.id,
            notificationID: null
          })
          .catch(error => {
            this.$emit("notify", {
              type: "error",
              text: error.message
            });
          });
      }
    },
    getuserColor(username) {
      let color = "";
      if (this.user.name === username) {
        color = this.user.rgba_color;
      } else {
        for (const key in this.user.users) {
          if (this.user.users.hasOwnProperty(key)) {
            const element = this.user.users[key];
            if (username === element.name) {
              color = element.rgba_color;
              break;
            }
          }
        }
      }
      return color;
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
