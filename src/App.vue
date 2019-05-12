<template>
  <div id="app">
    <v-app id="inspire">
      <v-content>
        <router-view :user="user" @authenticated="setUser" />
      </v-content>
    </v-app>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      authenticated: false,
      user: {
        id: null,
        name: null
      }
    };
  },
  mounted() {
    if (!this.authenticated) {
      this.$router.replace({ name: "login" });
    }
  },
  methods: {
    setUser(user) {
      this.authenticated = user.authenticated;
      this.user.id = user.id;
      this.user.name = user.name;
    },
    logout() {
      this.authenticated = false;
      this.user.id = null;
      this.user.name = null;
    }
  }
};
</script>
