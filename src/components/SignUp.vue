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
  methods: {
    signUp() {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
        (user) => {
          // записываем данные нового юзера в бд
          const newUserData = {
            name: this.name,
            id: user.uid,
            raiting: 0,
          };

          let updates = {};
          updates[`/users/${newUserData.id}`] = newUserData;

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
