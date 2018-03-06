<template>
  <div class="user-profile">
    <h1>{{ userName }}</h1>
    <span v-on:click="editName=!editName">edit</span>

    <div class="edit-name" v-if="editName">
      <span>{{ editNameText }}</span>
      <input type="text" v-model="updateName">
      <button v-on:click="updateUserName">Сохранить</button>
    </div>

    <button v-on:click="logout">Выйти</button>
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'UserProfile',
  data () {
    return {
      userName: firebase.auth().currentUser.email.replace(/@[^@]+$/, ''),
      updateName: '',
      editName: false,
      editNameText: 'Сменить имя'
    }
  },
  created: function() {
    if ( firebase.auth().currentUser ) {
      (!this.$route.params.userId) ? this.$router.push({ name: 'UserProfile', params: { userId: firebase.auth().currentUser.uid } }) : false;
    }
  },
  mounted: function() {
    if (firebase.auth().currentUser.displayName) {
      this.userName = firebase.auth().currentUser.displayName;
    } else {
      this.editNameText = 'Определите ваше имя, если требуется. Затем нажмите Сохранить';
      this.updateName = this.userName;
      this.editName = true;
    }
  },
  methods: {
    logout: function() {
      firebase.auth().signOut().then(() => {
        this.$router.push({ name: 'Login' })
      })
    },
    updateUserName: function() {
      firebase.auth().currentUser.updateProfile({
        displayName: this.updateName
      }).then((user) => {
        this.userName =  firebase.auth().currentUser.displayName;
        this.editName = false;
      }).catch((err) => {
        alert('Oops. Try Again' + err.message)
      });
    }
  }
}
</script>
