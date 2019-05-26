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
                :style="{
                  color: getuserColor(event.owner)
                }"
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
                  color: getuserColor(event.owner)
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
// import MeetingService from "@/services/MeetingService.js";
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
      this.events.forEach(e => (map[e.date] = map[e.date] || []).push(e));
      return map;
    }
  },
  mounted() {
    this.addCalUser(this.user.name, this.user.color);
    this.$refs.calendar.scrollToTime("08:00");
  },
  methods: {
    open(event) {
      alert(
        "----------EVENT DETAILS----------\nTitle: " +
          event.title +
          "\nDate: " +
          event.date +
          "\nTime: " +
          event.time +
          "\nDuration: " +
          event.duration +
          " minutes"
      );
    },
    addCalUser(username, color) {
      this.userColor[username] = color;
      this.events.concat([
        {
          owner: username,
          title: "Weekly Meeting",
          date: "2019-05-26",
          time: "09:00",
          duration: 45,
          attendees: []
        },
        {
          owner: username,
          title: "Thomas' Birthday",
          date: "2019-05-27"
        },
        {
          owner: username,
          title: "Mash Potatoes",
          date: "2019-05-28",
          time: "12:30",
          duration: 180
        }
      ]);
      // MeetingService.getUserEvents(username)
      //   .then(response => {
      //     if (response.data) {
      //       this.users[username]["color"] =
      //         "#" + ((Math.random() * 0xffffff) << 0).toString(16);
      //       this.events.concat(response.data);
      //     } else {
      //       this.$emit("notify", {
      //         type: "info",
      //         text: `No events found for user ${username}`
      //       });
      //     }
      //   })
      //   .catch(error => {
      //     this.$emit("notify", {
      //       type: "error",
      //       text: error.message
      //     });
      //   });
    },
    getuserColor(username) {
      return this.userColor[username];
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
