<template>
  <div class="stream-page">

    <h1><span>{{ streamRaiting }}</span> {{ streamTitle }}</h1>

    <p v-html="streamDesc"></p>

    <input type="text" id="streamLink" v-model="streamLink">
    <span @click="copyStreamLink">Копировать ссылку на стрим</span>

    <p>Осталось до конца раунда: <span>{{ cdRoundTime }}</span> {{ roundend }}</p>

    <div class="comments">
      <ul style="list-style-type: none;">
        <li v-for="comment in orderBy(comments, 'raiting', -1)" v-bind:key="comment.userid">
          <img width="50" height="50" v-bind:src="comment.useravatar">
          <span>{{ comment.username }}</span>
          <p>
            {{ comment.comment }}
            <br>
            Raiting: {{ comment.raiting }}
          </p>
          <div v-if="comment.userid !== userId">
            <div v-if="stream.temp.liked[userId] !== undefined">
              <button v-if="stream.temp.liked[userId].like === undefined" @click="commentLike(comment.userid)">Like</button>
              <button v-if="stream.temp.liked[userId].dislike === undefined" @click="commentDislike(comment.userid)">Dislike</button>
            </div>
            <div v-else>
              <button @click="commentLike(comment.userid)">Like</button>
              <button @click="commentDislike(comment.userid)">Dislike</button>
            </div>
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

    <div class="current">
      <div class="current-topcomments">
        <h3>Лучшие комментарии текущего стрима</h3>
        <ul>
          <li v-for="comment in limitBy(orderBy(streamCurrentComments, 'raiting', -1), 10)" v-bind:key="comment['.key']">
            <img width="20" height="20" v-bind:src="comment.useravatar">
            <span>{{ comment.username }}</span>
            <p>
              {{ comment.comment }}
              <br>
              Raiting: {{ comment.raiting }}
            </p>
          </li>
        </ul>
      </div>
      <div class="current-topusers">
        <h3>Лучшие пользователи текущего стрима</h3>
        <ul>
          <li v-for="user in limitBy(orderBy(streamCurrentUsers, 'raiting', -1), 5)" v-bind:key="user['.key']">
            <img width="30" height="30" v-bind:src="user.avatar">
            <p>
              <strong>{{ user.raiting }}</strong> | {{ user.name }}
            </p>
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
  name: 'StreamPage',
  data() {
    return {
      streamTitle: '',
      streamRaiting: 0,
      streamLink: window.location.href,

      userId: '',
      userName: '',
      userAvatar: '',
      userRaiting: '',
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
      roundTimer: '',
      cdRoundTime: 0,
    };
  },
  firebase: function() {
    return {
      streamCurrentComments: streamsRef.child(`${this.$route.params.streamLink}/current/topcomments`),
      streamCurrentUsers: streamsRef.child(`${this.$route.params.streamLink}/current/topusers`),
    }
  },
  computed: {
    comments() {
      let newCommentsArr = [];
      if (this.stream.temp.comments) {
        // for (let x = 0; x < Object.keys(this.stream.temp.comments).length; x += 1) {
        //   let newObj = this.stream.temp.comments[Object.keys(this.stream.temp.comments)[x]];
        //   newObj.userid = Object.keys(this.stream.temp.comments)[x];
        //   newCommentsArr.push(newObj);
        // }
        for (let key in this.stream.temp.comments) {
          let newObj = this.stream.temp.comments[key];
          newObj.userid = key;
          newCommentsArr.push(newObj);
        }
      }
      return newCommentsArr;
    },
    // создать функцию, которая возвращает оставщееся время до конца раунда
    roundend() {
      if (this.stream.temp.roundend) {
        console.log(this.stream.temp.roundend);
        this.roundTimer = setInterval(() => {
            const curSec = new Date().getTime();
            console.log(curSec);
            if (curSec < this.stream.temp.roundend) {
              const diff = Math.floor((this.stream.temp.roundend - curSec) / 1000);
              this.cdRoundTime = diff;
              return diff;
            } else {
              clearInterval(this.roundTimer);
              return 'x';
            }
        }, 1000);
      }
    },
  },
  created() {
    this.userId = firebase.auth().currentUser.uid;
    if (this.userId && this.$route.params.streamLink) {
      this.$watch('stream', () => {
        this.$bindAsObject(
          'stream',
          streamsRef.child(this.$route.params.streamLink),
          null,
          () => {
            // после получения данных о стриме
            this.streamRaiting = this.stream.raiting;
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
                () => {
                  this.userName = this.user.name;
                  this.userAvatar = this.user.avatar;
                  this.userRaiting = this.user.raiting;
                },
              );
            }
          },
        );
      }, {
        immediate: true,
        deep: true,
      });
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
          userraiting: this.userRaiting,
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
      // прибавляем к рейтингу комментария единицу
      const newRaiting = this.stream.temp.comments[commentId].raiting + 1;
      streamsRef.child(this.$route.params.streamLink).child('temp/comments/').child(commentId).update({ raiting: newRaiting });
      // записываем в liked uid текущего пользователя в качестве ключа и id комментария в значение
      streamsRef.child(this.$route.params.streamLink).child(`temp/liked/${this.userId}`).update({ like: commentId });
      this.$toaster.info('Вы использовали свой лайк в этом раунде');
    },
    commentDislike(commentId) {
      // снижаем рейтинг комментария на единицу
      const newRaiting = this.stream.temp.comments[commentId].raiting - 1;
      streamsRef.child(this.$route.params.streamLink).child('temp/comments/').child(commentId).update({ raiting: newRaiting });
      // записываем в liked uid текущего пользователя в качестве ключа и id комментария в значение
      streamsRef.child(this.$route.params.streamLink).child(`temp/liked/${this.userId}`).update({ dislike: commentId });
      this.$toaster.info('Вы использовали свой дислайк в этом раунде');
    },
    startStream() {
      // если таймер 0, то весь стрим считается одним раундом
      if (this.curRoundTime !== 0) {
        this.$toaster.success('Стрим запущен');
        const roundTimeMs = this.curRoundTime * 1000;
        this.timer = setInterval(() => {
          const roundEndMs = new Date().getTime() + roundTimeMs;
          streamsRef.child(this.$route.params.streamLink).child(`temp`).update({ roundend: roundEndMs });
          this.$toaster.info(`Раунд завершен!`);
        }, roundTimeMs);
      }
    },
    endStream() {
      clearInterval(this.timer);

      // 1. Проверяем есть ли комментарии в this.temp.comments
      if (this.comments.length > 0) {
        // 2. Берем данные комментария и записываем их (push) в this.stream.current.topcomments и в this.stream.topcomments
        this.comments.forEach((item) => {
          if (item.raiting > 0) {
            const curComment = {
              raiting: item.raiting,
              comment: item.comment,
              username: item.username,
              useravatar: item.useravatar,
              userraiting: item.userraiting, /* outdated */
              userid: item.userid,
            };
            streamsRef.child(this.$route.params.streamLink).child(`current/topcomments`).push(curComment);
            streamsRef.child(this.$route.params.streamLink).child(`topcomments/${item.userid}`).push(curComment);
            // 3. Берем данные комментатора и записываем (update) в this.stream.current.topusers и в this.stream.topusers
            // 3.1 Если пользователь уже есть в this.stream.current.topusers или в this.stream.topusers, то увеличиваем его рейтинг на величину рейтинга комментария
            const curUser = {
              raiting: item.raiting,
              name: item.username,
              avatar: item.useravatar,
              userraiting: item.userraiting, /* outdated */
            };

            if (this.stream.current.topusers[item.userid] === undefined) {
              streamsRef.child(this.$route.params.streamLink).child(`current/topusers/${item.userid}`).update(curUser);
            } else {
              streamsRef.child(this.$route.params.streamLink).child(`current/topusers/${item.userid}`).update({ raiting: this.stream.current.topusers[item.userid].raiting + item.raiting });
            }

            if (this.stream.topusers[item.userid] === undefined) {
              streamsRef.child(this.$route.params.streamLink).child(`topusers/${item.userid}`).update(curUser);
              usersRef.child(item.userid).child(`comments/${this.$route.params.streamLink}`).update({ raiting: item.raiting });
            } else {
              const newStreamRaiting = this.stream.topusers[item.userid].raiting + item.raiting;
              streamsRef.child(this.$route.params.streamLink).child(`topusers/${item.userid}`).update({ raiting: newStreamRaiting });
              usersRef.child(item.userid).child(`comments/${this.$route.params.streamLink}`).update({ raiting: newStreamRaiting });
            }
            // 3.2 Прибавляем рейтинг записанный в this.stream.topusers к общему рейтингу пользователя
            // 3.3 Добавляем рейтинг в суммарный рейтинг по стриму в usersRef.child(item.userid).child('comments').push()
            usersRef.child(item.userid).update({ raiting: item.userraiting + item.raiting });
            // 3.4 Добавляем рейтинг текущего комментария к общему рейтингу стрима
            streamsRef.child(this.$route.params.streamLink).update({ raiting: this.stream.raiting + item.raiting });
            this.streamRaiting = this.stream.raiting;
          }
        });
        // 4. Очищаем this.stream.temp.comments и this.stream.temp.liked
        streamsRef.child(this.$route.params.streamLink).child(`temp`).update({ comments: 0, liked: 0 });
      }
      // 5. this.stream.temp.roundend = 0
      streamsRef.child(this.$route.params.streamLink).child(`temp`).update({ roundend: 0 });
      this.$toaster.success('Вы успешно завершили стрим');
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
  destroyed() {
    clearInterval(this.roundTimer);
  },
};
</script>
