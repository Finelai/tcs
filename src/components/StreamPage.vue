<template>
  <div class="stream-page">

    <h1>{{ streamTitle }}</h1>

    <p v-html="streamDesc"></p>

    <input type="text" id="streamLink" v-model="streamLink">
    <span @click="copyStreamLink">Копировать ссылку на стрим</span>

    <p>Осталось до конца раунда: <span>{{ curRoundTime }}</span></p>

    <div class="comments">
      <ul style="list-style-type: none;">
        <li v-for="(comment, key) in stream.temp.comments" v-bind:key="key">
          <img width="50" height="50" v-bind:src="comment.useravatar">
          <span>{{ comment.username }}</span>
          <p>
            {{ comment.comment }}
            <br>
            Raiting: {{ comment.raiting }}
          </p>
          <div v-if="key !== userId">
            <button @click="commentLike(key)">Like</button>
            <button @click="commentDislike(key)">Dislike</button>
          </div>
        </li>
      </ul>
    </div>

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
      <textarea cols="30" rows="4" v-model='userComment'></textarea>
      <button @click="sendUserComment">Отправить</button>
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
      userId: '',
      userName: '',
      userAvatar: '',
      userComment: '',

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
  created() {
    this.userId = firebase.auth().currentUser.uid;
  },
  mounted() {
    if (this.userId && this.$route.params.streamLink) {
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
          if (this.userId === this.stream.streamerid) {
            this.owner = true;
          } else {
            // получаем данные о текущем пользователе
            this.$bindAsObject(
              'user',
              usersRef.child(this.userId),
              null,
              function () {
                this.userName = this.user.name;
                this.userAvatar = this.user.avatar;
              },
            );
          }
        },
      );
    }
  },
  methods: {
    sendUserComment() {
      // проверяем существует ли в temp / comments запись по текущему uid
      if (this.stream.temp.comments[this.userId] === undefined) {
        // если записи нет, то в temp добавляем userid { comment : Текст комментария, raiting: 0 }
        const newTempComment = {
          username: this.userName,
          useravatar: this.userAvatar,
          comment: this.userComment,
          raiting: 0,
        };
        let updates = {};
        updates[`/temp/comments/${this.userId}`] = newTempComment;
        streamsRef.child(this.$route.params.streamLink).update(updates);

        this.$toaster.success('Комментарий успешно опубликован');
        this.userComment = '';
      } else {
        this.$toaster.error('Вы уже оставляли комментарий в этом раунде');
      }
    },
    commentLike(commentId) {
      // toDo: упростить условие
      if (this.stream.temp.liked[this.userId]) {

        if (!this.stream.temp.liked[this.userId].like) {
          // прибавляем к рейтингу комментария единицу
          const newRaiting = this.stream.temp.comments[commentId].raiting + 1;
          streamsRef.child(this.$route.params.streamLink).child('temp/comments/').child(commentId).update({ raiting: newRaiting });
          // записываем в liked uid текущего пользователя в качестве ключа и id комментария в значение
          streamsRef.child(this.$route.params.streamLink).child(`temp/liked/${this.userId}`).update({ like: commentId });
          this.$toaster.info('Вы использовали свой лайк в этом раунде');
        } else {
          this.$toaster.error('Вы уже отдали свой лайк в этом раунде');
        }

      } else {
        // прибавляем к рейтингу комментария единицу
        const newRaiting = this.stream.temp.comments[commentId].raiting + 1;
        streamsRef.child(this.$route.params.streamLink).child('temp/comments/').child(commentId).update({ raiting: newRaiting });
        // записываем в liked uid текущего пользователя в качестве ключа и id комментария в значение
        streamsRef.child(this.$route.params.streamLink).child(`temp/liked/${this.userId}`).update({like: commentId });
        this.$toaster.info('Вы использовали свой лайк в этом раунде');
      }
    },
    commentDislike(commentId) {
      // toDo: упростить условие
      if (this.stream.temp.liked[this.userId]) {

        if (!this.stream.temp.liked[this.userId].dislike) {
          // снижаем рейтинг комментария на единицу
          const newRaiting = this.stream.temp.comments[commentId].raiting - 1;
          streamsRef.child(this.$route.params.streamLink).child('temp/comments/').child(commentId).update({ raiting: newRaiting });
          // записываем в liked uid текущего пользователя в качестве ключа и id комментария в значение
          streamsRef.child(this.$route.params.streamLink).child(`temp/liked/${this.userId}`).update({ dislike: commentId });
          this.$toaster.info('Вы использовали свой дислайк в этом раунде');
        } else {
          this.$toaster.error('Вы уже отдали свой дислайк в этом раунде');
        }

      } else {
        // снижаем рейтинг комментария на единицу
        const newRaiting = this.stream.temp.comments[commentId].raiting - 1;
        streamsRef.child(this.$route.params.streamLink).child('temp/comments/').child(commentId).update({ raiting: newRaiting });
        // записываем в liked uid текущего пользователя в качестве ключа и id комментария в значение
        streamsRef.child(this.$route.params.streamLink).child(`temp/liked/${this.userId}`).update({ dislike: commentId });
        this.$toaster.info('Вы использовали свой дислайк в этом раунде');
      }
    },
    startStream() {
      // если таймер 0, то весь стрим считается одним раундом
      if (this.curRoundTime !== 0) {
        const roundTimeMs = this.curRoundTime * 1000;
        this.timer = setInterval(() => {
          console.log(new Date().getTime());
          console.log('tack');
        }, roundTimeMs);
      }
    },
    endStream() {
      // добавить проверку на существование интервала
      // если интервал не создан, то проделать все операции по сбору комментариев
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
