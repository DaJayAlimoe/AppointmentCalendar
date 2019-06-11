<template>
  <v-flex xs4>
    <v-card class="mx-auto" max-width="400">
      <v-card flat>
        <v-card-title>
          <!-- <v-select
            v-model="selected"
            :items="getResourceBySelected(false)"
            placeholder="Select Resource"
            @change="selectResource"
            solo
          ></v-select>-->
          <v-select
            v-model="selected"
            :hint="`${selected.name}, category : ${selected.category}`"
            :items="resource.resources"
            item-text="name"
            item-value="name"
            label="Resource"
            @change="selectResource(selected)"
            persistent-hint
            return-object
            single-line
          ></v-select>
        </v-card-title>
      </v-card>
      <template v-if="show">
        <v-card-text class="py-0">
          <v-timeline align-top dense>
            <template v-for="event in resourceEvents">
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
      </template>
    </v-card>
  </v-flex>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      show: false,
      previous: null,
      selected: { name: "None", category: "None" },
      events: []
    };
  },
  mounted() {},
  computed: {
    ...mapState(["meeting", "resource"]),
    resourceEvents() {
      return this.events;
    }
  },
  methods: {
    selectResource(resource) {
      if (resource === null) resource = this.selected;
      if (this.meeting.date) {
        this.$store
          .dispatch("resource/fetchResourceEvents", resource.name)
          .then(response => {
            if (response.data != undefined && response.data.length != 0) {
              this.events = response.data;
              this.show = true;
            } else {
              this.$emit("notify", {
                type: "info",
                text: `No Events found on ${this.meeting.date} for ${
                  resource.name
                }`
              });
              this.events = [];
              this.show = false;
            }
            if (this.previous) {
              this.$store.dispatch(
                "resource/deselectResource",
                this.previous.name
              );
            }
            this.previous = resource;
          })
          .catch(error => {
            this.$emit("notify", {
              type: "error",
              text: error.message
            });
          });
      } else {
        this.$emit("notify", {
          type: "info",
          text: `Please select a date to check the availability of the resource`,
          timeout: 3000
        });
      }
    },
    destroy() {
      this.$store.dispatch("resource/deselectResource", this.selected.name);
    }
  }
};
</script>

<style lang="scss" scoped></style>
