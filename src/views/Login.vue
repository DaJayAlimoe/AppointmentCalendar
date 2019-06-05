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
                v-model="user.name"
              ></v-text-field>
              <v-text-field
                prepend-icon="lock"
                name="password"
                label="Password"
                id="password"
                type="password"
                v-model="password"
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
import { mapState } from "vuex";
export default {
  name: "Login",
  data() {
    return { password: null };
  },
  computed: {
    ...mapState(["user"])
  },
  methods: {
    onSubmit() {
      if (this.user.name && this.password) {
        this.$store
          .dispatch("login", {
            username: this.user.name,
            password: this.password
          })
          .then(response => {
            if (response) {
              this.$emit("notify", {
                type: "success",
                text: "Login Successful"
              });
              this.$router.replace({ name: "home" });
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
          type: "error",
          text: "Username and Password Required"
        });
      }

      //   // if (this.user.name && this.user.password && !this.user.authenticated) {
      //   //   UserService.login(this.user.name, this.user.password)
      //   //     .then(response => {
      //   //       if (response.data) {
      //   //         this.$emit("authenticated", {
      //   //           name: this.user.name,
      //   //           authenticated: response.data
      //   //         });
      //   //         this.user.name = null;
      //   //         this.user.password = null;
      //   //       } else {
      //   //         this.$emit("notify", {
      //   //           type: "error",
      //   //           text: "Invalid Credentials try again!"
      //   //         });
      //   //       }
      //   //     })
      //   //     .catch(error => {
      //   //       this.$emit("notify", {
      //   //         type: "error",
      //   //         text: error.message
      //   //       });
      //   //     });
      //   // } else {
      //   //   this.$emit("notify", {
      //   //     type: "error",
      //   //     text: "Username and Password Required"
      //   //   });
      //   // }
    }
  }
};
</script>

<style scoped></style>
