<template>
  <div class="user-profile">

    <h1><em>{{ userRaiting }}</em> {{ userName }}</h1>

    <p><router-link v-if="streamer" :to="{ name: 'StreamPage', params: { streamLink: this.user.streamer } }">Перейти на стрим</router-link></p>

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

    <div v-if="Object.keys(comments).length === 0 ">
      <p>У этого пользователя нет ни одного комментария с положительным рейтингом</p>
    </div>
    <div v-else class="comments">
      <div v-for="streamComments in orderBy(comments, 'userRaitingByStream', -1)" v-bind:key="streamComments.streamLink">
        <p>{{ streamComments.userRaitingByStream }} <router-link :to="{ name: 'StreamPage', params: { streamLink: streamComments.streamLink } }">{{ streamComments.streamTitle }}</router-link></p>
        <ul>
          <li v-for="(oneComment, index) in orderBy(streamComments.userComments, 'raiting', -1)" v-bind:key="index">
            <p><strong>{{ oneComment.raiting }}</strong> {{ oneComment.comment }}</p>
          </li>
        </ul>
      </div>
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

      userRaiting: 0,

      owner: false,
      streamer: false,
      streamCreate: false,
      streamTitle: '',
      streamLink: '',
      profileLink: '',

      comments: [],
    };
  },
  created() {
    // отображение ссылки пользователя
    if (firebase.auth().currentUser && !this.$route.params.userId) {
      this.$router.push({ name: 'UserProfile', params: { userId: firebase.auth().currentUser.uid } });
    }

    // TODO: Создание ссылки на страницу пользователя заданного вида
    // а если в базе данных у этого пользователя создана запись link, то пушем не id пользователя а link
    // после чего берем this.$route.params.userId и ищем в бд пользователя с таким id, после чего получаем его данные в объекте

    if (firebase.auth().currentUser.uid && this.$route.params.userId) {
      this.$bindAsObject(
        'user',
        usersRef.child(this.$route.params.userId),
        null,
        () => {
          this.userName = this.user.name;
          this.userAvatar = this.user.avatar;
          this.userRaiting = this.user.raiting;
          this.streamer = this.user.streamer || false;

          // 1. Проверяем есть ли в user.comments записи
          if (this.user.comments !== 0) {
            // 2. Проходим циклом по записям, берем user.comments[key] и получаем данные из streams
            for (let key in this.user.comments) {
              console.log(key, this.user.comments[key].raiting);
              this.$bindAsArray(
                key,
                streamsRef.child(key).child(`topcomments`).child(this.$route.params.userId),
                null,
                () => {
                  // 3. Записываем полученные комментарии в массив, а массив в общий объект
                  // this.comments = Object.assign({}, this.comments, {
                  //   [key]: {
                  //     userRaitingByStream: this.user.comments[key].raiting,
                  //     streamTitle: '',
                  //     userComments: this[key],
                  //   },
                  // });

                  // получаем stream title из бд отдельным запросом
                  // db.ref(`/streams/${key}/settings`).once('value').then((snapshot) => { this.comments[key].streamTitle = snapshot.val().title; });
                  db.ref(`/streams/${key}/settings`).once('value').then((snapshot) => {
                    // реализуем через добавление в массив для сортировки
                    this.comments.push({
                      streamLink: key,
                      userRaitingByStream: this.user.comments[key].raiting,
                      streamTitle: snapshot.val().title,
                      userComments: this[key],
                    });
                  });
                },
              );
            }
          }
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
        () => {
          this.$toaster.error('Потеряно соединение с базой данных. Попробуйте ещё раз!');
        },
        () => {
          if (this.stream.streamer) {
            this.$toaster.error(`Стрим c таким именем (${this.streamLink}) уже существует`);
          } else {
            usersRef.child(firebase.auth().currentUser.uid).update({ streamer: this.streamLink });

            const newStreamData = {
              streamerid: firebase.auth().currentUser.uid,
              streamername: this.userName,
              streameravatar: this.userAvatar,
              settings: {
                title: this.streamTitle,
                roundtime: 60,
              },
              raiting: 0,
              topcomments: 0,
              topusers: 0,
              current: {
                topcomments: 0,
                topusers: 0,
              },
              temp: {
                roundend: 0,
                comments: 0,
                liked: 0,
              },
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
