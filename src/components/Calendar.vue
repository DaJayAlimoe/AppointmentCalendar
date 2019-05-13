<template>
  <v-layout wrap>
    <v-flex xs12 class="mb-3">
      <v-sheet height="500">
        <v-calendar
          ref="calendar"
          v-model="start"
          :end="end"
          type="week"
          color="primary"
        ></v-calendar>
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
export default {
  data: () => ({
    events: [],
    start: "2019-01-01",
    end: "2019-01-06"
  })
};
</script>

<style lang="stylus" scoped>
.my-event {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 2px;
  background-color: #1867c0;
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
