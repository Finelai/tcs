<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button v-on:click="logout">Logout</button>
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to TCS, '
    }
  },
  methods: {
    logout: function() {
      firebase.auth().signOut().then(() => {
        this.$router.replace('login')
      })
    }
  }
}
</script>
