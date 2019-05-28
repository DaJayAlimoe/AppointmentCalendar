<template>
  <v-flex xs4>
    <v-card class="mx-auto" max-width="400">
      <v-card flat>
        <v-card-title>
          <v-select
            v-model="selected"
            :items="resourceNames"
            placeholder="Select Resource"
            @change="selectResource"
            solo
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
import MeetingService from "@/services/MeetingService.js";
export default {
  props: ["resources", "date", "id"],
  data() {
    return {
      show: false,
      selected: null,
      events: []
    };
  },
  mounted() {},
  computed: {
    resourceEvents() {
      return this.events;
    },
    resourceNames() {
      let res = [];
      for (const key in this.resources) {
        if (this.resources.hasOwnProperty(key)) {
          res[key] = this.resources[key].name;
        }
      }
      return res;
    }
  },
  methods: {
    selectResource(selectedResource) {
      if (this.date) {
        this.show = false;
        MeetingService.getResourceEvents(selectedResource, this.date)
          .then(response => {
            if (response.data != undefined && response.data.length != 0) {
              this.events = response.data;
              this.show = true;
            } else {
              this.$emit("notify", {
                type: "info",
                text: "No Events found for the selected Date!"
              });
            }
          })
          .catch(error => {
            this.$emit("notify", {
              type: "error",
              text: error.message
            });
          });
        this.$emit("selectChange", {
          id: this.id,
          selected: selectedResource
        });
      }
    },
    getSelectedResource() {
      return this.selected;
    }
  }
};
</script>

<style lang="scss" scoped></style>
