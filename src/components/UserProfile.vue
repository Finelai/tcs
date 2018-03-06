<template>
  <div class="user-profile">
    <h1>{{ msg }}</h1>
    <button v-on:click="logout">Logout</button>
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'UserProfile',
  data () {
    return {
      msg: 'Welcome to TCS, ' + firebase.auth().currentUser.email
    }
  },
  created: function() {
    if ( firebase.auth().currentUser ) {
      (!this.$route.params.userId) ? this.$router.push({ name: 'UserProfile', params: { userId: firebase.auth().currentUser.uid } }) : false;
    }
  },
  methods: {
    logout: function() {
      firebase.auth().signOut().then(() => {
        this.$router.push({ name: 'Login' })
      })
    }
  }
}
</script>
