<template>
  <div class="login">
    <h3>Вход</h3>
    <input type="text" v-model="email" placeholder="Email"><br>
    <input type="password" v-model="password" placeholder="Password"><br>
    <button v-on:click="signIn">Login</button>
    <p>You don't have an account ? You can <router-link to="/sign-up">create one</router-link></p>
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'login',
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    signIn() {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
        (user) => {
          this.$router.push({
            name: 'UserProfile',
            params: { userId: user.uid },
          });
        },
        (err) => {
          this.$toaster.error(`Error: ${err.message}`);
        },
      );
    },
  },
};
</script>
