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
        <li v-for="userName of names" v-bind:key="userName['.key']">
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
import { namesRef } from '../config/firebase';

export default {
  data() {
    return {
      name: ''
    }
  },
  firebase: {
    names: namesRef
  },
  methods: {
    submitName() {
      namesRef.push({
        name: this.name,
        edit: false
      });
      this.name = '';
      this.$toaster.success('New user added to database.')
    },
    removeName(key) {
      namesRef.child(key).remove();
    },
    setEditName(key) {
      namesRef.child(key).update({ edit: true });
    },
    cancelEdit(key) {
      namesRef.child(key).update({ edit: false });
    },
    saveEdit(person) {
      const key = person['.key'];
      namesRef.child(key).set({ name: person.name, edit: false })
    }
  }
};
</script>
