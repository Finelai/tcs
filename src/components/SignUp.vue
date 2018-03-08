<template>
  <div class="sign-up">
    <p>Let's create a new account !</p>
    <input type="text" v-model="name" placeholder="Name"><br>
    <input type="text" v-model="email" placeholder="Email"><br>
    <input type="password" v-model="password" placeholder="Password"><br>
    <button v-on:click="signUp">Sign Up</button>
    <span>or go back to <router-link to="/login">login</router-link>.</span>
  </div>
</template>

<script>
import { usersRef } from '../../config/firebase';
import firebase from 'firebase';

export default {
  name: 'signUp',
  data() {
    return {
      name: '',
      email: '',
      password: '',
    };
  },
  methods: {
    signUp() {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
        (user) => {
          usersRef.push({
            name: this.name,
            id: user.uid,
            raiting: 0,
          });
          this.$toaster.success('Welcome, ' + this.name);
          this.$router.replace('user');
        },
        (err) => {
          this.$toaster.error('Error: ' + err.message);
        },
      );
    },
  },
};
</script>
