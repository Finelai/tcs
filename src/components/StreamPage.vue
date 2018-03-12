<template>
  <div class="stream-page">

    <h1>{{ streamTitle }}</h1>

    <p v-html="streamDesc"></p>

    <input type="text" id="streamLink" v-model="streamLink">
    <span @click="copyStreamLink">Копировать ссылку на стрим</span>

    <div class="streamer-settings" v-if="owner">
      <button @click="startStream">Начать стрим</button>
      <button @click="endStream">Завершить стрим</button>

      <h3>Настройки</h3>
      <p>
        Текущая продолжительность раунда:
        <strong v-if="!editRoundTime"> {{ curRoundTime }} секунд</strong>
        <span v-else>
          <input type="text" v-model="newRoundTime">
          <button @click="updateRoundTime">Сохранить</button>
        </span>
      </p>
      <button @click="editRoundTime = !editRoundTime">Сменить продолжительность раунда</button>
      <button @click="editStreamTitle = !editStreamTitle">Сменить заголовок</button>
      <button @click="editStreamDesc = !editStreamDesc">Сменить описание</button>

      <div v-if="editStreamTitle">
        <input type="text" v-model="newStreamTitle">
        <button @click="updateStreamTitle">Сохранить</button>
      </div>

      <div v-if="editStreamDesc">
        <textarea cols="30" rows="10" v-model="newStreamDesc"></textarea>
        <button @click="updateStreamDesc">Сохранить</button>
      </div>

    </div>

    <div class="user-commentform" v-else>
      <span>{{ userName }}</span>
      <img width="100" height="100" v-bind:src="userAvatar">
      <br>
      <textarea name="" id="" cols="30" rows="4"></textarea>
      <button>Отправить</button>
    </div>

  </div>
</template>

<script>
import firebase from 'firebase';
import { usersRef, streamsRef, db } from '../../config/firebase';

export default {
  name: 'StreamPage',
  data() {
    return {
      streamTitle: '',
      streamLink: window.location.href,
      userName: '',
      userAvatar: '',

      owner: false,

      curRoundTime: 0,
      editRoundTime: false,
      newRoundTime: 0,

      editStreamTitle: false,
      newStreamTitle: '',

      streamDesc: 'Стример ещё не добавил описание к стриму',
      editStreamDesc: false,
      newStreamDesc: '',

      timer: '',
    };
  },
  mounted() {
    if (firebase.auth().currentUser.uid && this.$route.params.streamLink) {
      this.$bindAsObject(
        'stream',
        streamsRef.child(this.$route.params.streamLink),
        null,
        function () {
          // после получения данных о стриме
          this.streamTitle = this.stream.settings.title;
          this.newStreamTitle = this.stream.settings.title;
          this.curRoundTime = this.stream.settings.roundtime;
          this.newRoundTime = this.stream.settings.roundtime;
          if (this.stream.settings.description) {
            this.streamDesc = this.stream.settings.description;
            this.newStreamDesc = this.stream.settings.description;
          }
          // проверяем является ли текущий пользователем владельцем стрима
          if (firebase.auth().currentUser.uid === this.stream.streamerid) {
            this.owner = true;
          } else {
            // получаем данные о текущем пользователе
            this.$bindAsObject(
              'user',
              usersRef.child(firebase.auth().currentUser.uid),
              null,
              function () {
                this.userName = this.user.name;
                this.userAvatar = this.user.avatar;
              }
            );
          }
        },
      );
    }
  },
  methods: {
    startStream() {
      if (this.curRoundTime !== 0) {
        const roundTimeMs = this.curRoundTime * 1000;
        this.timer = setInterval(() => {
          console.log(new Date().getTime());
          console.log('tack');
        }, roundTimeMs);
      }
    },
    endStream() {
      clearInterval(this.timer);
    },
    updateStreamTitle() {
      streamsRef.child(this.$route.params.streamLink).child('settings').update({ title: this.newStreamTitle });
      this.editStreamTitle = false;
      this.streamTitle = this.newStreamTitle;
      this.$toaster.success('Вы успешно сменили заголовок стрима');
    },
    updateStreamDesc() {
      streamsRef.child(this.$route.params.streamLink).child('settings').update({ description: this.newStreamDesc });
      this.editStreamDesc = false;
      this.streamDesc = this.newStreamDesc;
      this.$toaster.success('Вы успешно сменили описание стрима');
    },
    updateRoundTime() {
      streamsRef.child(this.$route.params.streamLink).child('settings').update({ roundtime: this.newRoundTime });
      this.editRoundTime = false;
      this.curRoundTime = this.newRoundTime;
      this.$toaster.success('Вы успешно сменили время раунда');
    },
    copyStreamLink() {
      const curProfileLink = document.querySelector('#streamLink');

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
