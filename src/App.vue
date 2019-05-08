<template>
  <div id="app">
    <v-app id="inspire">
      <v-content>
        <v-container fluid fill-height>
          <v-layout align-center justify-center>
            <div id="nav">
              <router-link
                v-if="authenticated"
                to="/login"
                v-on:click.native="logout()"
                replace
                >Logout</router-link
              >
            </div>
            <router-view @authenticated="setUser" />
          </v-layout>
        </v-container>
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
