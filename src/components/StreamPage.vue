<template>
  <el-main class="stream-page">

    <el-row type="flex" justify="end">
      <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8" style="text-align:right;">
        <el-form :inline="true">
          <el-form-item label="Ссылка на стрим:">
            <el-input v-model="streamLink" id="streamLink"></el-input>
          </el-form-item>
          <el-button @click="copyStreamLink" type="info" icon="el-icon-share">Копировать</el-button>
        </el-form>
      </el-col>
    </el-row>

    <div style="text-align:center;display:inline-block;width:100%">
      <i class="el-icon-star-on"></i> <span>{{ streamRaiting }}</span> <h1>{{ streamTitle }}</h1>
      <el-button v-if="owner" type="text" @click="updateStreamTitle">Сменить заголовок</el-button>
    </div>

    <el-row>
      <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
        <div id="video"></div>
        <el-carousel v-if="topComments.length > 0" :interval="5000" type="card" height="600px">
          <el-carousel-item v-for="topcomments in limitBy(topComments, 5)" :key="topcomments['.key']">
            <img :src="topcomments.useravatar" width="50" height="50">
            <p><strong>{{ topcomments.username }}:</strong> <br> {{ topcomments.comment }}</p>
          </el-carousel-item>
        </el-carousel>
        <el-carousel v-else :interval="5000" type="card" height="600px">
          <el-carousel-item>
            <p>На этом стриме еще нет ни одного Лучшего комментария за все время</p>
          </el-carousel-item>
        </el-carousel>
        <p v-html="streamDesc"></p>
        <el-button v-if="owner" type="text" @click="editStreamDesc = !editStreamDesc">Сменить описание</el-button>
        <div v-if="editStreamDesc">
          <textarea cols="30" rows="10" v-model="newStreamDesc"></textarea>
          <button @click="updateStreamDesc">Сохранить</button>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
        <div class="comments">
          <h6><i class="el-icon-info"></i> Оценивайте комментарии. У вас есть только 1 лайк и 1 дислайк в раунде.</h6>
          <div v-for="comment in orderBy(comments, 'raiting', -1)" v-bind:key="comment.userid" style="margin-bottom:30px;">
            <el-row>
              <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4"><pre></pre></el-col>
              <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
                <img width="25" height="25" v-bind:src="comment.useravatar" style="vertical-align:bottom"><span>{{ comment.username }}:</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                <el-rate
                  v-model="comment.raiting"
                  disabled
                  show-score
                  :low-threshold="10"
                  :high-threshold="50"
                  :max="1"
                  :colors="['#99A9BF', '#FF9900', '#ff6969']">
                </el-rate>
              </el-col>
              <el-col :xs="16" :sm="16" :md="16" :lg="16" :xl="16" style="background-color:#66b1ff;">
                <p>{{ comment.comment }}</p>
              </el-col>
              <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" v-if="comment.userid !== userId">
                <div v-if="stream.temp.liked[userId] !== undefined">
                  <el-button v-if="stream.temp.liked[userId].like === undefined" type="success" icon="el-icon-caret-top" size="mini" @click="commentLike(comment.userid)"></el-button>
                  <el-button v-if="stream.temp.liked[userId].dislike === undefined" type="danger" icon="el-icon-caret-bottom" size="mini" @click="commentDislike(comment.userid)"></el-button>
                </div>
                <div v-else>
                  <el-button type="success" icon="el-icon-caret-top" size="mini" @click="commentLike(comment.userid)"></el-button>
                  <el-button type="danger" icon="el-icon-caret-bottom" size="mini" @click="commentDislike(comment.userid)"></el-button>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>

        <p>Осталось до конца раунда: <span>{{ cdRoundTime }}</span> {{ roundend }}</p>

        <div class="streamer-settings" v-if="owner">
          <h3>Управление</h3>
          <el-button type="success" @click="startStream">Начать стрим</el-button>
          <el-button type="danger" @click="endStream">Завершить стрим</el-button>

          <p>Текущая продолжительность раунда: {{ curRoundTime }} сек.</p>
          <el-button type="primary" @click="updateRoundTime">Изменить продолжительность раунда</el-button>

          <img :src="curPreview">
          <el-button type="primary" @click="updatePreview">Сменить превью</el-button>
        </div>

        <div class="user-commentform" v-else>
          <img width="25" height="25" v-bind:src="userAvatar"><span>{{ userName }}:</span>
          <el-row>
            <el-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
              <el-input
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 2}"
                resize="none"
                placeholder="Напишите свой комментарий"
                v-model="userComment">
              </el-input>
            </el-col>
            <el-col :xs="24" :sm="24" :md="4" :lg="4" :xl="4">
              <el-button v-if="userComment !== ''" type="primary" size="small" @click="sendUserComment">Отправить</el-button>
              <el-button v-else type="primary" size="small" disabled>Отправить</el-button>
            </el-col>
          </el-row>
          <h6><i class="el-icon-info"></i> Вы можете отправить только 1 комментарий за раунд</h6>
        </div>
      </el-col>
    </el-row>

    <el-row class="current">
      <el-col :xs="24" :sm="24" :md="12" :lg="9" :xl="9" v-if="streamCurrentComments.length > 0" class="current-topcomments">
        <h3>Лучшие комментарии текущего стрима</h3>
        <div v-for="comment in limitBy(orderBy(streamCurrentComments, 'raiting', -1), 10)" v-bind:key="comment['.key']" style="margin-bottom:30px;">
          <el-row>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4"><pre></pre></el-col>
            <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
              <img width="25" height="25" v-bind:src="comment.useravatar" style="vertical-align:bottom"><span>{{ comment.username }}:</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
              <el-rate
                v-model="comment.raiting"
                disabled
                show-score
                :low-threshold="10"
                :high-threshold="50"
                :max="1"
                :colors="['#99A9BF', '#FF9900', '#ff6969']">
              </el-rate>
            </el-col>
            <el-col :xs="16" :sm="16" :md="16" :lg="16" :xl="16" style="background-color:#66b1ff;">
              <p>{{ comment.comment }}</p>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="9" :xl="9" v-if="streamCurrentUsers.length > 0" class="current-topusers">
        <h3>Лучшие комментаторы текущего стрима</h3>
        <el-row v-for="user in limitBy(orderBy(streamCurrentUsers, 'raiting', -1), 5)" v-bind:key="user['.key']" style="margin-bottom:30px;">
          <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
            <el-rate
              v-model="user.raiting"
              disabled
              show-score
              :low-threshold="50"
              :high-threshold="100"
              :max="1"
              :colors="['#99A9BF', '#FF9900', '#ff6969']">
            </el-rate>
          </el-col>
          <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
            <img width="40" height="40" v-bind:src="user.avatar" style="vertical-align:bottom"><span>{{ user.name }}</span>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-row class="top">
      <el-col :xs="24" :sm="24" :md="12" :lg="9" :xl="9" v-if="topComments.length > 0" class="topcomments">
        <h3>Лучшие комментарии за все время</h3>
        <div v-for="topcomment in limitBy(orderBy(topComments, 'raiting', -1), 10)" v-bind:key="topcomment['.key']" style="margin-bottom:30px;">
          <el-row>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4"><pre></pre></el-col>
            <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
              <img width="25" height="25" v-bind:src="topcomment.useravatar" style="vertical-align:bottom"><span>{{ topcomment.username }}:</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
              <el-rate
                v-model="topcomment.raiting"
                disabled
                show-score
                :low-threshold="10"
                :high-threshold="50"
                :max="1"
                :colors="['#99A9BF', '#FF9900', '#ff6969']">
              </el-rate>
            </el-col>
            <el-col :xs="16" :sm="16" :md="16" :lg="16" :xl="16" style="background-color:#66b1ff;">
              <p>{{ topcomment.comment }}</p>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="9" :xl="9" v-if="topUsers.length > 0" class="topusers">
        <h3>Лучшие комментаторы за все время</h3>
        <el-row v-for="topuser in limitBy(orderBy(topUsers, 'raiting', -1), 10)" v-bind:key="topuser['.key']" style="margin-bottom:30px;">
          <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
            <el-rate
              v-model="topuser.raiting"
              disabled
              show-score
              :low-threshold="100"
              :high-threshold="500"
              :max="1"
              :colors="['#99A9BF', '#FF9900', '#ff6969']">
            </el-rate>
          </el-col>
          <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
            <img width="40" height="40" v-bind:src="topuser.avatar" style="vertical-align:bottom"><span>{{ topuser.name }}</span>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

  </el-main>
</template>

<script>
import firebase from 'firebase';
import { usersRef, streamsRef } from '../../config/firebase';
// import VueScript2 from 'vue-script2';

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

      curPreview: '',

      streamDesc: 'Стример ещё не добавил описание к стриму',
      editStreamDesc: false,
      newStreamDesc: '',

      timer: '',
      roundTimer: '',
      cdRoundTime: 0,

      load: null,
    };
  },
  firebase: function() {
    return {
      streamCurrentComments: streamsRef.child(`${this.$route.params.streamLink}/current/topcomments`),
      streamCurrentUsers: streamsRef.child(`${this.$route.params.streamLink}/current/topusers`),
      topComments: streamsRef.child(`${this.$route.params.streamLink}/topcomments`),
      topUsers: streamsRef.child(`${this.$route.params.streamLink}/topusers`),
    };
  },
  computed: {
    comments() {
      let newCommentsArr = [];
      if (this.stream.temp.comments) {
        for (const key in this.stream.temp.comments) {
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
        this.roundTimer = setInterval(() => {
          const curSec = new Date().getTime();
          if (curSec < this.stream.temp.roundend) {
            const diff = Math.floor((this.stream.temp.roundend - curSec) / 1000);
            this.cdRoundTime = diff;
            if (diff === 1) { clearInterval(this.roundTimer); }
            return diff;
          } else if (curSec >= this.stream.temp.roundend) {
            clearInterval(this.roundTimer);
          }
          return 'x';
        }, 1000);
      }
    },
  },
  created() {
    if (firebase.auth().currentUser) {
      this.userId = firebase.auth().currentUser.uid;
    } else {
      this.$router.push({ name: 'Login' });
    }

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
            this.curRoundTime = this.stream.settings.roundtime;
            this.curPreview = this.stream.settings.preview;
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
  mounted() {
    // TODO: Настроить авторизацию через Twitch, чтобы работал этот код:
    // let twitchScript = document.createElement('script');
    // twitchScript.async = true;
    // twitchScript.setAttribute('src', 'http://player.twitch.tv/js/embed/v1.js');
    // document.head.appendChild(twitchScript);

    // VueScript2.load('http://player.twitch.tv/js/embed/v1.js').then(() => {
    //   let player = new Twitch.Player("video", {
    //     width: 1280,
    //     height: 720,
    //     channel: "igromania",
    //   });
    //   player.setVolume(0.5);
    // })
  },
  methods: {
    clearTempComments() {
      // 1. Проверяем есть ли комментарии в this.temp.comments
      if (this.comments.length > 0) {
        this.load = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.8)',
        });
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
            streamsRef.child(this.$route.params.streamLink).child('current/topcomments').push(curComment);
            streamsRef.child(this.$route.params.streamLink).child('topcomments').push(curComment);
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
        streamsRef.child(this.$route.params.streamLink).child('temp').update({ comments: 0, liked: 0 });
        this.load.close();
      }
    },
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
        const updates = {};
        updates[`/temp/comments/${this.userId}`] = newTempComment;
        streamsRef.child(this.$route.params.streamLink).update(updates);

        this.$message({
          message: 'Комментарий успешно опубликован',
          type: 'success',
        });
        this.userComment = '';
      } else {
        this.$message({
          message: 'Вы уже оставляли комментарий в этом раунде',
          type: 'error',
        });
      }
    },
    commentLike(commentId) {
      // прибавляем к рейтингу комментария единицу
      const newRaiting = this.stream.temp.comments[commentId].raiting + 1;
      streamsRef.child(this.$route.params.streamLink).child('temp/comments/').child(commentId).update({ raiting: newRaiting });
      // записываем в liked uid текущего пользователя в качестве ключа и id комментария в значение
      streamsRef.child(this.$route.params.streamLink).child(`temp/liked/${this.userId}`).update({ like: commentId });
      this.$message('Вы использовали свой лайк в этом раунде');
    },
    commentDislike(commentId) {
      // снижаем рейтинг комментария на единицу
      const newRaiting = this.stream.temp.comments[commentId].raiting - 1;
      streamsRef.child(this.$route.params.streamLink).child('temp/comments/').child(commentId).update({ raiting: newRaiting });
      // записываем в liked uid текущего пользователя в качестве ключа и id комментария в значение
      streamsRef.child(this.$route.params.streamLink).child(`temp/liked/${this.userId}`).update({ dislike: commentId });
      this.$message('Вы использовали свой дислайк в этом раунде');
    },
    startStream() {
      // Вначале стрима очищаем this.stream.temp и this.stream.current без записи результатов
      streamsRef.child(this.$route.params.streamLink).child('temp').update({ comments: 0, liked: 0 });
      streamsRef.child(this.$route.params.streamLink).child('current').update({ topcomments: 0, topusers: 0 });
      // если таймер 0, то весь стрим считается одним раундом
      if (this.curRoundTime !== 0) {
        this.$message({
          message: 'Стрим запущен',
          type: 'success',
        });
        const roundTimeMs = this.curRoundTime * 1000;
        this.timer = setInterval(() => {
          const roundEndMs = new Date().getTime() + roundTimeMs;
          streamsRef.child(this.$route.params.streamLink).child('temp').update({ roundend: roundEndMs });
          this.$message('Раунд завершен!');
          this.clearTempComments();
        }, roundTimeMs);
      }
    },
    endStream() {
      clearInterval(this.timer);
      this.clearTempComments();

      // this.stream.temp.roundend = 0
      streamsRef.child(this.$route.params.streamLink).child('temp').update({ roundend: 0 });
      this.$message({
        message: 'Вы успешно завершили стрим',
        type: 'success',
      });
    },
    updateStreamTitle() {
      this.$prompt('Введите новое название:', 'Смена названия стрима', {
        confirmButtonText: 'Сохранить',
        cancelButtonText: 'Отмена',
        inputPlaceholder: this.streamTitle,
        inputValidator: (value) => {
          if (value === '') {
            return 'Введите название';
          } else if (value.length < 2 || value.length > 30) {
            return 'Названи должно быть от 2-х до 30-ти символов';
          }
          return true;
        },
      }).then(result => {
        streamsRef.child(this.$route.params.streamLink).child('settings').update({ title: result.value });
        this.streamTitle = result.value;
        this.$message({
          type: 'success',
          message: 'Вы успешно сменили заголовок стрима на:' + result.value,
        });
      }).catch(() => {
        this.$message({
          type: 'error',
          message: 'Ошибка',
        });
      });
    },
    updateStreamDesc() {
      streamsRef.child(this.$route.params.streamLink).child('settings').update({ description: this.newStreamDesc });
      this.editStreamDesc = false;
      this.streamDesc = this.newStreamDesc;
      this.$message({
        message: 'Вы успешно сменили описание стрима',
        type: 'success',
      });
    },
    updateRoundTime() {
      this.$prompt('Введите новое время раунда в секундах', 'Продолжительность раунда', {
        confirmButtonText: 'Сохранить',
        cancelButtonText: 'Отмена',
        inputPattern: /^\d+$/,
        inputErrorMessage: 'Только цифры'
      }).then(result => {
        streamsRef.child(this.$route.params.streamLink).child('settings').update({ roundtime: result.value });
        this.curRoundTime = result.value;
        this.$message({
          type: 'success',
          message: 'Новое время раунда:' + result.value,
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Ошибка',
        });
      });
    },
    updatePreview() {
      this.$prompt('Вставьте ссылку на новое превью', 'Превью', {
        confirmButtonText: 'Сохранить',
        cancelButtonText: 'Отмена',
      }).then(result => {
        streamsRef.child(this.$route.params.streamLink).child('settings').update({ preview: result.value });
        this.curPreview = result.value;
        this.$message({
          type: 'success',
          message: 'Установлено новое превью',
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Ошибка',
        });
      });
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
        this.$message({
          message: 'Ссылка успешно скопирована',
          type: 'success',
        });
      } catch (err) {
        this.$message({
          message: 'Копирование невозможно в вашем браузере',
          type: 'error',
        });
        this.$message({
          message: 'Скопируйте ссылку вручную',
          type: 'warning',
        });
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

<style>
  .el-carousel__item img {
    width: 100%;
    height: 100%;
    opacity: .1;
  }
  .el-carousel__item p {
    color: #000;
    opacity: 0.75;
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
