<template>
  <v-container fluid grid-list-xl>
    <Home />
  </v-container>
</template>

<script>
import Home from "@/components/Home.vue";
export default {
  data() {
    return {};
  },
  components: {
    Home
  },
  computed: {
    layoutAttributes() {
      return {};
    }
  },
  methods: {
    formatAttributes() {
      return ``;
    }
  }
};
</script>
