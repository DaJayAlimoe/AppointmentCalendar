<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-card-text>
            <v-form @submit.prevent="onSubmit">
              <v-text-field
                prepend-icon="person"
                name="username"
                label="Username"
                type="text"
                v-model="user.username"
              ></v-text-field>
              <v-text-field
                prepend-icon="lock"
                name="password"
                label="Password"
                id="password"
                type="password"
                v-model="user.password"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn type="submit" color="primary" @click="onSubmit">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import UserService from "@/services/UserService.js";
export default {
  name: "Login",
  data() {
    return {
      user: {
        username: null,
        password: null,
        authenticated: false
      },
      errors: []
    };
  },
  methods: {
    onSubmit() {
      this.$emit("authenticated", {
        name: "tester",
        id: 223,
        authenticated: true
      });
      this.$router.replace({ name: "home" });
      if (
        this.user.username &&
        this.user.password &&
        !this.user.authenticated
      ) {
        // this.$emit("authenticated", {
        //   name: this.user.username,
        //   id: this.user.password,
        //   authenticated: true
        // });
        // this.$router.replace({ name: "home" });
        // this.user.username = null;
        // this.user.password = null;
        UserService.login(this.user.username, this.user.password)
          .then(response => {
            let user = response.data;
            this.$emit("authenticated", user);
            this.$router.replace({ name: "home" });
            this.user.username = null;
            this.user.password = null;
          })
          .catch(error => {
            console.log("There was an error:", error.response); // Logs out the error
          });
      } else {
        if (!this.user.username) this.errors.push("Username Required");
        if (!this.user.password) this.errors.push("Password Required");
      }
    }
  }
};
</script>

<style scoped></style>
