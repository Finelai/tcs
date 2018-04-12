<template>
  <el-main class="user-profile">

    <el-row type="flex" justify="space-between">
      <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
        <el-card class="user-card" :body-style="{ padding: '0px', position: 'relative' }">
          <img class="user-card__avatar" v-bind:src="userAvatar">
          <el-badge class="user-card__raiting" :value="userRaiting"/>
          <div v-if="userStatus === 'offline'" class="user-card__status user-card__status--offline">.</div>
          <div v-else class="user-card__status user-card__status--online">.</div>
          <div class="user-card__bottom">
            <h1 class="user-card__name">{{ userName }}</h1>
            <el-row>
              <el-col class="user-card__stream" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                <span v-if="streamer">
                  <router-link  :to="{ name: 'StreamPage', params: { streamLink: this.user.streamer } }">Cтрим</router-link>
                </span>
                <pre v-else></pre>
              </el-col>
              <el-col class="user-card__follow-button" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                <el-button type="text" @click="follow('user', userName)">Следить</el-button>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">

          <el-form :inline="true">
            <el-form-item label="Ссылка на профиль:">
              <el-input v-model="profileLink" id="profileLink"></el-input>
            </el-form-item>
            <el-button @click="copyProfileLink" type="info" icon="el-icon-share">Копировать</el-button>
          </el-form>

          <el-tabs type="border-card" v-if="owner">
            <el-tab-pane>
              <span slot="label"><i class="el-icon-info"></i> Информация</span>
              <el-button @click="logout" type="info">Выйти</el-button>
            </el-tab-pane>

            <el-tab-pane>
              <span slot="label"><i class="el-icon-date"></i> Сменить имя</span>
              <div class="edit-name">
                <p>Введите новое имя:</p>
                <el-form :model="formData" :inline="true" :rules="rules" status-icon>
                  <el-form-item prop="updateName">
                    <el-input v-model="formData.updateName"></el-input>
                  </el-form-item>
                  <el-button @click="updateUserName" type="primary">Сменить</el-button>
                </el-form>
              </div>
            </el-tab-pane>

            <el-tab-pane>
              <span slot="label"><i class="el-icon-picture"></i> Сменить аватар</span>
              <div class="edit-avatar">
                <p>Вставьте ссылку на аватар:</p>
                <el-form :inline="true">
                  <el-form-item>
                    <el-input v-model="updateAvatar"></el-input>
                  </el-form-item>
                  <el-button @click="updateUserAvatar" type="primary">Сменить</el-button>
                </el-form>
              </div>
            </el-tab-pane>

            <el-tab-pane v-if="!streamer">
              <span slot="label"><i class="el-icon-caret-right"></i> Стать стримером</span>
              <div>
                <el-form :model="formData" ref="formData" :rules="rules" status-icon>
                  <el-form-item prop="streamTitle">
                    <label>Название стрима (будет отображаться на странице):</label>
                    <el-input v-model="formData.streamTitle" placeholder="Например, Vasya Stream"></el-input>
                  </el-form-item>
                  <el-form-item prop="streamLink">
                    <label>Уникальная ссылка (латинские буквы, без цифр и спецсимволов):</label>
                    <el-input v-model="formData.streamLink" placeholder="Например, vasya-stream"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button @click="createNewStream('formData')" type="primary">Создать</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>
          </el-tabs>

      </el-col>
    </el-row>

    <div v-if="Object.keys(comments).length === 0 ">
      <p>У этого пользователя пока нет ни одного лучшего комментария</p>
    </div>
    <div v-else class="comments">
      <h4>Лучшие комментарии {{ userName }}, упорядоченные по рейтингу</h4>
      <div v-for="streamComments in orderBy(comments, 'userRaitingByStream', -1)" v-bind:key="streamComments.streamLink">
        <el-row class="comments__stream" type="flex" justify="end">
          <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
            <div class="comments__stream-block">
              <div class="comments__stream-raiting raiting_colorize">
                <i class="el-icon-star-on"></i>
                <span>{{ streamComments.userRaitingByStream }}</span>
              </div>
              <router-link class="comments__stream-link" :to="{ name: 'StreamPage', params: { streamLink: streamComments.streamLink } }">{{ streamComments.streamTitle }}</router-link>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <hr>
          </el-col>
        </el-row>
        <el-row class="comments__item one-comment" v-if="oneComment.userid === $route.params.userId" v-for="(oneComment, index) in orderBy(streamComments.userComments, 'raiting', -1)" v-bind:key="index">
          <el-col class="one-comment__raiting" :xs="4" :sm="4" :md="2" :lg="2" :xl="2">
            <div class="raiting_colorize">
              <i class="el-icon-star-on"></i>
              <span>{{ oneComment.raiting }}</span>
            </div>
          </el-col>
          <el-col class="one-comment__text" :xs="20" :sm="20" :md="14" :lg="14" :xl="14">
            <p>{{ oneComment.comment }}</p>
          </el-col>
        </el-row>
      </div>
    </div>

  </el-main>
</template>

<script>
import firebase from 'firebase';
import { usersRef, streamsRef, db } from '../../config/firebase';

export default {
  name: 'UserProfile',
  data() {
    const validateStreamLink = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Введите ссылку'));
      } else if (value.length < 3) {
        callback(new Error('Ссылка должен быть длинее 2х символов'));
      } else if (/[^a-z-]/.test(value)) {
        callback(new Error('Только латинские буквы в нижнем регистре и тире'));
      } else {
        callback();
      }
    };
    return {
      formData: {
        updateName: '',
        streamTitle: '',
        streamLink: '',
      },
      rules: {
        updateName: [
          { min: 2, max: 30, message: 'Имя от 2 до 30 символов', trigger: 'blur' },
        ],
        streamTitle: [
          { required: true, message: 'Укажите название стрима', trigger: 'blur' },
          { min: 2, max: 30, message: 'Название от 2 до 30 символов', trigger: 'blur' },
        ],
        streamLink: [
          { required: true, validator: validateStreamLink, trigger: 'blur' },
        ],
      },
      userStatus: '',
      userName: '',

      userAvatar: '',
      updateAvatar: '',

      userRaiting: 0,

      owner: false,
      streamer: false,
      profileLink: window.location.href,

      comments: [],
    };
  },
  created() {
    if (firebase.auth().currentUser) {
      if (firebase.auth().currentUser.uid === this.$route.params.userId) {
        this.owner = true;
      }
    }

    // TODO: Создание ссылки на страницу пользователя заданного вида
    // а если в базе данных у этого пользователя создана запись link, то пушем не id пользователя а link
    // после чего берем this.$route.params.userId и ищем в бд пользователя с таким id, после чего получаем его данные в объекте

    if (this.$route.params.userId) {
      this.$bindAsObject(
        'user',
        usersRef.child(this.$route.params.userId),
        null,
        () => {
          this.userStatus = this.user.status;
          this.userName = this.user.name;
          this.userAvatar = this.user.avatar;
          this.userRaiting = this.user.raiting;
          this.streamer = this.user.streamer || false;

          // 1. Проверяем есть ли в user.comments записи
          if (this.user.comments !== 0) {
            // 2. Проходим циклом по записям, берем user.comments[key] и получаем данные из streams/topcomments
            for (const key in this.user.comments) {
              this.$bindAsArray(
                key,
                streamsRef.child(key).child('topcomments'),
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
    }
  },
  methods: {
    logout() {
      firebase.auth().signOut().then(() => {
        this.$router.push({ name: 'Login' });
      });
    },
    updateUserName() {
      if (this.formData.updateName !== '' && this.formData.updateName.length > 1) {
        usersRef.child(firebase.auth().currentUser.uid).update({ name: this.formData.updateName });
        this.userName = this.formData.updateName;
        this.$message({
          message: 'Вы успешно сменили имя',
          type: 'success',
        });
        this.formData.updateName = '';
      }
    },
    updateUserAvatar() {
      usersRef.child(firebase.auth().currentUser.uid).update({ avatar: this.updateAvatar });
      this.userAvatar = this.updateAvatar;
      this.$message({
        message: 'Ваш аватар успешно заменен',
        type: 'success',
      });
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
    createNewStream(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$bindAsObject(
            'stream',
            streamsRef.child(this.formData.streamLink),
            () => {
              this.$message({
                message: 'Потеряно соединение с базой данных. Попробуйте ещё раз!',
                type: 'error',
              });
            },
            () => {
              if (this.stream.streamer) {
                this.$message({
                  message: `Стрим c таким названием (${this.formData.streamLink}) уже существует`,
                  type: 'error',
                });
              } else {
                usersRef.child(firebase.auth().currentUser.uid).update({ streamer: this.formData.streamLink });

                const newStreamData = {
                  streamerid: firebase.auth().currentUser.uid,
                  streamername: this.userName,
                  streameravatar: this.userAvatar,
                  settings: {
                    title: this.formData.streamTitle,
                    roundtime: 60,
                    preview: 'http://via.placeholder.com/320x180',
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

                const updates = {};
                updates[`/streams/${this.formData.streamLink}`] = newStreamData;
                db.ref().update(updates);
                this.$message({
                  message: `Стрим ${this.formData.streamTitle} успешно создан`,
                  type: 'success',
                });
                this.$router.push({ name: 'StreamList' });
              }
            },
          );
        } else {
          this.$message({
            message: 'Заполните все поля формы',
            type: 'error',
          });
          return false;
        }
      });
    },
    followStream() {
      // todo: реализовать follow
      this.$message({
        message: 'Вы подписались на оповещения о стриме',
        type: 'success',
      });
    },
  },
};
</script>

<style src="../assets/scss/components/user-profile.scss" lang="scss" scoped></style>
