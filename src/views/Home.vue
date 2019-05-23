<template>
  <v-container fluid grid-list-xl>
    <v-container fluid grid-list-xl>
      <v-layout row justify-space-between>
        <v-flex sm4 xs12 class="text-sm-left text-xs-center">
          <v-btn
            id="create_appointment"
            small
            color="primary"
            @click.stop="dialog = true"
            >Create</v-btn
          >
          <MeetingAssistant :visible="dialog" @close="dialog = false" />
        </v-flex>
        <v-spacer></v-spacer>
        <v-flex sm4 xs12 class="text-sm-right text-xs-center">
          <v-btn id="user_logout" dark small color="secondary" @click="logout"
            >logout</v-btn
          >
        </v-flex>
      </v-layout>
      <v-spacer></v-spacer>
      <v-layout align-center justify-space-around row>
        <v-flex xs12>
          <Calendar :user="this.user" />
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
import Calendar from "@/components/Calendar.vue";
import MeetingAssistant from "@/components/MeetingAssistant.vue";
export default {
  name: "Home",
  props: ["user"],
  data() {
    return {
      dialog: false
    };
  },
  components: {
    Calendar,
    MeetingAssistant
  },
  methods: {
    logout() {
      this.$emit("logout");
      this.$router.replace({ name: "login" });
    }
  }
};
</script>
<style lang="scss" scoped></style>
