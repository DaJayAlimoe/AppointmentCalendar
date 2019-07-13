<template>
  <v-snackbar
    v-model="state"
    :color="alert.type"
    :top="true"
    :middle="true"
    :timeout="alert.timeout"
  >
    {{ snackbar.message }}
    <v-btn dark flat @click.prevent="clearAlert()">Close</v-btn>
  </v-snackbar>
</template>

<script>
import { setTimeout } from "timers";
import { mapActions } from "vuex";
export default {
  props: {
    alert: {
      type: Object,
      required: true
    }
  },
  created() {
    console.log("created");
    this.state = true;
  },
  mounted() {
    this.timer = setTimeout(() => {
      this.state = false;
      this.remove(this.alert);
    }, this.timeout);
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  data() {
    return { state: false, timeout: 2000, timer: null };
  },
  methods: {
    ...mapActions("alert", ["remove"]),
    clearAlert() {
      this.state = false;
      this.remove(this.alert);
    }
  }
};
</script>

<style lang="scss" scoped></style>
