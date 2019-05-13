<template>
  <v-container fluid grid-list-xl>
    <v-layout row justify-space-between>
      <v-flex sm4 xs12 class="text-sm-left text-xs-center">
        <v-btn id="create_appointment" small color="primary">Create</v-btn>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex sm4 xs12 class="text-sm-right text-xs-center">
        <v-btn id="user_logout" dark small color="secondary">logout</v-btn>
      </v-flex>
    </v-layout>
    <v-spacer></v-spacer>
    <v-layout align-center justify-space-around row>
      <v-flex xs12>
        <Calendar />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Calendar from "@/components/Calendar.vue";
export default {
  name: "Home",
  data() {
    return {};
  },
  components: {
    Calendar
  },
  methods: {
    logout() {}
  }
};
</script>

<style lang="scss" scoped></style>
