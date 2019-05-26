<template>
  <v-flex xs4>
    <v-card class="mx-auto" max-width="400">
      <v-card flat>
        <v-card-title>
          <v-select
            v-model="selected"
            :items="users"
            placeholder="Select Resource"
            solo
          ></v-select>
        </v-card-title>
      </v-card>
      <v-card-text class="py-0">
        <v-timeline align-top dense>
          <template v-for="event in events">
            <v-timeline-item color="warning" small :key="event.time">
              <v-layout pt-3>
                <v-flex xs3>
                  <strong>{{ event.time }}</strong>
                </v-flex>
                <v-flex>
                  <strong>{{ event.title }}</strong>
                  <div class="caption">{{ event.duration / 60 }} hrs</div>
                </v-flex>
              </v-layout>
            </v-timeline-item>
          </template>
        </v-timeline>
      </v-card-text>
    </v-card>
  </v-flex>
</template>
<script>
export default {
  data() {
    return {
      users: ["Beamer", "Room", "Whiteboard"],
      selected: null,
      events: [
        {
          title: "Weekly Meeting",
          time: "09:00",
          duration: 120
        },
        {
          title: "Thomas' Birthday",
          time: "11:30",
          duration: 120
        },
        {
          title: "Mash Potatoes",
          time: "12:30",
          duration: 120
        }
      ]
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped></style>
