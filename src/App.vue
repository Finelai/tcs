<template>
  <el-container id="app">

    <el-header>
      <h2>{{ title }}</h2>
    </el-header>

    <nav class="top-menu">
      <el-menu mode="horizontal">
          <el-menu-item index="StreamList">
            <router-link :to="{ name: 'StreamList' }">Стримы</router-link>
          </el-menu-item>
          <el-menu-item index="UserList">
            <router-link :to="{ name: 'UserList' }">Участники</router-link>
          </el-menu-item>
          <el-menu-item index="SignUp" v-if="!userId">
            <router-link :to="{ name: 'SignUp' }">Регистрация</router-link>
          </el-menu-item>
          <el-menu-item index="Login" v-if="!userId">
            <router-link :to="{ name: 'Login' }">Вход</router-link>
          </el-menu-item>
          <el-menu-item index="UserProfile" v-if="userId">
            <router-link :to="{ name: 'UserProfile', params: { userId: userId }}">Мой профиль</router-link>
          </el-menu-item>
          <el-menu-item index="StreamPage" v-if="streamLink">
            <router-link :to="{ name: 'StreamPage', params: { streamLink: streamLink }}">Мой стрим</router-link>
          </el-menu-item>
      </el-menu>
    </nav>

    <transition :name="transitionName">
      <router-view/>
    </transition>

    <el-footer>
      <p>{{ currentYear }} &copy; {{ title }} | <a href="https://github.com/Finelai/tcs" target="_blank">GitHub</a></p>
    </el-footer>
  </el-container>
</template>

<script>
import firebase from 'firebase';
import { db } from '../config/firebase';

export default {
  data() {
    return {
      title: 'Top Comment System',
      userId: 0,
      streamLink: undefined,
      currentYear: new Date().getFullYear(),
      transitionName: '',
    };
  },
  watch: {
    '$route' (to, from) {
      const toDepth = to.path.split('/').length;
      const fromDepth = from.path.split('/').length;
      this.transitionName = toDepth < fromDepth ? 'slide-top' : 'slide-bot';
    },
  },
  created() {
    if (firebase.auth().currentUser) {
      this.userId = firebase.auth().currentUser.uid;
    }
    if (this.userId) {
      db.ref(`/users/${this.userId}`).once('value').then((snapshot) => {
        if (snapshot.val().streamer !== 0) {
          this.streamLink = snapshot.val().streamer;
        }
      });
    }
  },
};
</script>
