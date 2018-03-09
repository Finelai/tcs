<template>
  <div class="user-profile">
    <h1>{{ userName }}</h1>
    <img width="100" v-bind:src="userAvatar">
    <div>
      <button v-on:click="editName=!editName">Сменить имя</button>
      <button v-on:click="editAvatar=!editAvatar">Сменить аватар</button>
    </div>

    <div class="edit-name" v-if="editName">
      <span>Введите новое имя и нажмите Сохранить</span>
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
import { usersRef, db } from '../../config/firebase';

export default {
  name: 'UserProfile',
  data() {
    return {
      userName: '',
      editName: false,
      updateName: '',
      userAvatar: '',
      editAvatar: false,
      updateAvatar: '',
    };
  },
  created() {
    // отображение ссылки пользователя
    if (firebase.auth().currentUser && !this.$route.params.userId) {
      this.$router.push({ name: 'UserProfile', params: { userId: firebase.auth().currentUser.uid } });
    }
    // а если в базе данных у этого пользователя создана запись link, то пушем не id пользователя а link
    // после чего берем this.$route.params.userId и ищем в бд пользователя с таким id, после чего получаем его данные в объекте
  },
  mounted() {
    // получаем id авторизованного пользователя и выводим его имя и аватар из бд
    if (firebase.auth().currentUser.uid) {
      this.$bindAsObject(
        'user',
        usersRef.child(firebase.auth().currentUser.uid),
        null,
        function() {
          this.userName = this.user.name;
          this.userAvatar = this.user.avatar;
        },
      );
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
