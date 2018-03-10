<template>
  <div class="user-profile">

    <h1>{{ userName }}</h1>

    <img width="100" v-bind:src="userAvatar">

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

    <div v-if="owner">
      <input type="text" id="profileLink" v-model="profileLink">
      <span @click="copyProfileLink">Copy Link</span>
      <button v-on:click="editName=!editName">Сменить имя</button>
      <button v-on:click="editAvatar=!editAvatar">Сменить аватар</button>
      <button v-on:click="logout">Выйти</button>
    </div>

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
      owner: false,
      profileLink: '',
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
    if (firebase.auth().currentUser.uid && this.$route.params.userId) {
      this.$bindAsObject(
        'user',
        usersRef.child(this.$route.params.userId),
        null,
        function() {
          this.userName = this.user.name;
          this.userAvatar = this.user.avatar;
        },
      );
      if (firebase.auth().currentUser.uid === this.$route.params.userId) {
        this.owner = true;
        this.profileLink = window.location.href;
      }
    }
  },
  methods: {
    logout() {
      firebase.auth().signOut().then(() => {
        this.$router.push({ name: 'Login' });
      });
    },
    updateUserName() {
      usersRef.child(firebase.auth().currentUser.uid).update({ name: this.updateName });
      this.userName = this.updateName;
      this.editName = false;
      this.$toaster.success('Вы успешно сменили имя');
      this.updateName = '';
    },
    updateUserAvatar() {
      usersRef.child(firebase.auth().currentUser.uid).update({ avatar: this.updateAvatar });
      this.userAvatar = this.updateAvatar;
      this.editAvatar = false;
      this.$toaster.success('Ваш аватар успешно заменен');
      this.updateAvatar = '';
    },
    copyProfileLink() {
      const curProfileLink = document.querySelector('#profileLink');

      const range = document.createRange();
      range.selectNode(curProfileLink);
      window.getSelection().addRange(range);

      curProfileLink.select();

      try {
        // Теперь, когда мы выбрали текст ссылки, выполним команду копирования
        document.execCommand('copy');
        this.$toaster.success('Ссылка успешно скопирована.');
      } catch (err) {
        this.$toaster.error('Копирование невозможно в вашем браузере');
        this.$toaster.info('Скопируйте ссылку вручную');
      }
      // Снятие выделения
      window.getSelection().removeAllRanges();
    },
  },
};
</script>
