<template>
  <div id="app">
    <header>
      <div class="header-wrapper">
        <nav>
          <router-link :to="{ name: 'StreamPage' }">Stream Page</router-link>
          <router-link :to="{ name: 'SignUp' }">SignUp</router-link>
          <router-link :to="{ name: 'Login' }">Login</router-link>
          <router-link :to="{ name: 'UserProfile' }">Profile</router-link>
          <router-link :to="{ name: 'ComponentForm' }">Comment Form</router-link>
        </nav>
      </div>
    </header>

    <div>
      <label>Name</label>
      <input type="text" v-model="name">
      <button @click="submitName()">Add</button>
    </div>

    <div>
      <ul>
        <li v-for="userName of users" v-bind:key="userName['.key']">
          <div v-if="!userName.edit">
            <p>{{ userName }}</p>
            <button @click="removeName(userName['.key'])">Remove</button>
            <button @click="setEditName(userName['.key'])">Edit</button>
          </div>
          <div v-else>
            <input type="text" v-model="userName.name">
            <button @click="saveEdit(userName)">Save</button>
            <button @click="cancelEdit(userName['.key'])">Cancel</button>
          </div>
        </li>
      </ul>
    </div>

    <router-view/>
  </div>
</template>

<script>
import { usersRef } from '../config/firebase';

export default {
  data() {
    return {
      name: '',
    };
  },
  firebase: {
    // сортируем по рейтингу
    users: usersRef.orderByChild('raiting'),
  },
  methods: {
    submitName() {
      usersRef.push({
        name: this.name,
        edit: false,
        raiting: 0,
      });
      this.name = '';
      this.$toaster.success('New user added to database.');
    },
    removeName(key) {
      usersRef.child(key).remove();
    },
    setEditName(key) {
      usersRef.child(key).update({ edit: true });
    },
    cancelEdit(key) {
      usersRef.child(key).update({ edit: false });
    },
    saveEdit(person) {
      const key = person['.key'];
      usersRef.child(key).set({ name: person.name, edit: false });
    },
  },
};
</script>
