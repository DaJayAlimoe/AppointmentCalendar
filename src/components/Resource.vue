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
            :items="getResourceBySelected(false)"
            item-text="name"
            item-value="name"
            label="Resource"
            @change="selectResource"
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
import { mapGetters, mapState } from "vuex";
export default {
  data() {
    return {
      show: false,
      selected: { name: "None", category: "None" }
    };
  },
  mounted() {},
  computed: {
    ...mapState(["meeting"]),
    ...mapGetters("resource", ["getResourceBySelected"]),
    resourceEvents() {
      return this.events;
    }
  },
  methods: {
    selectResource(resourceName) {
      if (this.meeting.date) {
        this.$store
          .dispatch("resource/fetchResourceEvents", resourceName)
          .then(response => {
            if (response != undefined && response.length != 0) {
              this.events = response;
              this.show = true;
            } else {
              this.$emit("notify", {
                type: "info",
                text: `No Events found on ${
                  this.meeting.date
                } for ${resourceName}`
              });
            }
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
          timeout: 4000
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
