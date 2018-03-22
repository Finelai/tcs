<template>
  <el-container id="app">

    <el-header>
      <h2>{{ title }}</h2>
    </el-header>

    <nav>
      <el-menu mode="horizontal" router>
          <el-menu-item index="/streamlist">Стримы</el-menu-item>
          <el-menu-item index="/userlist">Участники</el-menu-item>
          <el-menu-item v-if="!userId" index="/sign-up">Регистрация</el-menu-item>
          <el-menu-item v-if="!userId" index="/login">Вход</el-menu-item>
          <el-menu-item index="/user">Профиль</el-menu-item>
          <el-menu-item v-if="streamLink !== 0" v-bind:index="streamLink">Стрим</el-menu-item>
      </el-menu>
    </nav>

    <router-view/>

    <el-footer>
      <p>{{ currentYear }} &copy; {{ title }}</p>
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
      streamLink: 0,
      currentYear: new Date().getFullYear(),
    };
  },
  created() {
    this.userId = firebase.auth().currentUser.uid;
    if (this.userId) {
      db.ref(`/users/${this.userId}`).once('value').then((snapshot) => {
        if (snapshot.val().streamer !== 0) {
          this.streamLink = `stream/${snapshot.val().streamer}`;
        }
      });
    }
  },
};
</script>
