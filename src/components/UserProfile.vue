<template>
  <div class="user-profile">

    <h1>{{ userName }}</h1>

    <img width="100" v-bind:src="userAvatar">

    <div class="edit-name" v-if="editName">
      <label>Введите новое имя и нажмите Сохранить</label>
      <input type="text" v-model="updateName">
      <button v-on:click="updateUserName">Сохранить</button>
    </div>

    <div class="edit-avatar" v-if="editAvatar">
      <label>Вставьте ссылку на ваш аватар</label>
      <input type="text" v-model="updateAvatar">
      <button v-on:click="updateUserAvatar">Сохранить</button>
    </div>

    <div v-if="owner">
      <input type="text" id="profileLink" v-model="profileLink">
      <span @click="copyProfileLink">Copy Link</span>
      <button v-on:click="editName=!editName">Сменить имя</button>
      <button v-on:click="editAvatar=!editAvatar">Сменить аватар</button>
      <button v-on:click="logout">Выйти</button>
      <br>
      <button v-if="!streamer" v-on:click="streamCreate=!streamCreate">Стать стримером</button>
    </div>

    <div v-if="streamCreate">
      <label>Название стрима (будет отображаться на странице):</label>
      <br>
      <input type="text" v-model="streamTitle">
      <br>
      <label>Ссылка (латинские, без цифр, уникальное):</label>
      <br>
      <input type="text" v-model="streamLink">
      <br>
      <button v-on:click="createNewStream">Создать</button>
    </div>

  </div>
</template>

<script>
import firebase from 'firebase';
import { usersRef, streamsRef, db } from '../../config/firebase';

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
      streamer: false,
      streamCreate: false,
      streamTitle: '',
      streamLink: '',
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
        function () {
          this.userName = this.user.name;
          this.userAvatar = this.user.avatar;
          this.streamer = this.user.streamer || false;
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
    createNewStream() {
      this.$bindAsObject(
        'stream',
        streamsRef.child(this.streamLink),
        function () {
          this.$toaster.error('Потеряно соединение с базой данных. Попробуйте ещё раз!');
        },
        function () {
          if (this.stream.streamer) {
            this.$toaster.error(`Стрим c таким именем (${this.streamLink}) уже существует`);
          } else {
            usersRef.child(firebase.auth().currentUser.uid).update({ streamer: this.streamLink });

            const newStreamData = {
              streamer: firebase.auth().currentUser.uid,
              settings: {
                title: this.streamTitle,
                roundtime: 60,
              },
              raiting: 0,
            };

            let updates = {};
            updates[`/streams/${this.streamLink}`] = newStreamData;
            db.ref().update(updates);
            this.streamCreate = false;
            this.$toaster.success(`Стрим ${this.streamTitle} успешно создан`);
            this.$router.replace('streamlist');
          }
        },
      );
    },
  },
};
</script>
