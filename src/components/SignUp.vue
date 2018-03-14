<template>
  <div class="sign-up">
    <p>Создать новый аккаунт</p>
    <input type="text" v-model="name" placeholder="Name"><br>
    <input type="text" v-model="email" placeholder="Email"><br>
    <input type="password" v-model="password" placeholder="Password"><br>
    <button v-on:click="signUp">Sign Up</button>
    <span>or go back to <router-link to="/login">login</router-link>.</span>
  </div>
</template>

<script>
import firebase from 'firebase';
import { db } from '../../config/firebase';

export default {
  name: 'signUp',
  data() {
    return {
      name: '',
      email: '',
      password: '',
    };
  },
  computed: {
    randomAvatar() {
      const min = 2;
      const max = 9;
      return Math.floor(Math.random() * ((max - min) + 1)) + min;
    },
    randomAvatar3() {
      const min = 2;
      const max = 9;
      let randRes = '';
      for (let x = 0; x < 3; x += 1) {
        randRes += Math.floor(Math.random() * ((max - min) + 1)) + min;
      }
      return randRes;
    },
  },
  methods: {
    signUp() {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
        (user) => {
          // записываем данные нового юзера в бд
          const newUserData = {
            name: this.name,
            email: user.email,
            avatar: `https://api.adorable.io/avatars/face/eyes${this.randomAvatar}/nose${this.randomAvatar}/mouth1/${this.randomAvatar3}`,
            raiting: 0,
            streamer: 0,
          };

          let updates = {};
          updates[`/users/${user.uid}`] = newUserData;

          db.ref().update(updates);

          this.$toaster.success(`Добро Пожаловать, ${this.name}`);
          this.$router.replace('user');
        },
        (err) => {
          this.$toaster.error(`Error: ${err.message}`);
        },
      );
    },
  },
};
</script>
