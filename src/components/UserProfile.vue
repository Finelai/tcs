<template>
  <div class="user-profile">
    <h1>{{ userName }}</h1>
    <img width="100" v-bind:src="userAvatar">
    <div>
      <button v-on:click="editName=!editName">Сменить имя</button>
      <button v-on:click="editAvatar=!editAvatar">Сменить аватар</button>
    </div>

    <div class="edit-name" v-if="editName">
      <span>{{ editNameText }}</span>
      <input type="text" v-model="updateName">
      <button v-on:click="updateUserName">Сохранить</button>
    </div>

    <div class="edit-avatar" v-if="editAvatar">
      <span>Вставьте ссылку на ваш аватар</span>
      <input type="text" v-model="updateAvatar">
      <button v-on:click="updateUserAvatar">Сохранить</button>
    </div>

    <button v-on:click="logout">Выйти</button>
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'UserProfile',
  data() {
    return {
      userName: firebase.auth().currentUser.email.replace(/@[^@]+$/, ''),
      updateName: '',
      editName: false,
      editNameText: 'Сменить имя',
      userAvatar: 'https://api.adorable.io/avatars/face/eyes4/nose4/mouth1/666',
      editAvatar: false,
      updateAvatar: '',
    };
  },
  created() {
    // отображение ссылки пользователя
    if (firebase.auth().currentUser && !this.$route.params.userId) {
      this.$router.push({ name: 'UserProfile', params: { userId: firebase.auth().currentUser.uid } });
    }
  },
  mounted() {
    // проверка задано ли у пользователя отображаемое имя
    if (firebase.auth().currentUser.displayName) {
      this.userName = firebase.auth().currentUser.displayName;
    } else {
      this.editNameText = 'Определите ваше имя, если требуется. Затем нажмите Сохранить';
      this.updateName = this.userName;
      this.editName = true;
    }

    // проверка на наличие аватара у пользователя
    if (firebase.auth().currentUser.photoURL) {
      this.userAvatar = firebase.auth().currentUser.photoURL;
    }
  },
  methods: {
    logout() {
      firebase.auth().signOut().then(() => {
        this.$router.push({ name: 'Login' });
      });
    },
    updateUserName() {
      firebase.auth().currentUser.updateProfile({
        displayName: this.updateName,
      }).then((user) => {
        this.userName = firebase.auth().currentUser.displayName;
        this.editName = false;
        this.$toaster.success('Вы успешно сменили имя');
      }).catch((err) => {
        this.$toaster.error('Try again.');
      });
    },
    updateUserAvatar() {
      firebase.auth().currentUser.updateProfile({
        photoURL: this.updateAvatar,
      }).then((user) => {
        this.userAvatar = firebase.auth().currentUser.photoURL;
        this.editAvatar = false;
        this.$toaster.success('Ваш аватар успешно заменен');
      }).catch((err) => {
        this.$toaster.error('Try again.');
      });
    },
  },
};
</script>
