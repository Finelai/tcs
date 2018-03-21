<template>
  <el-container id="app">

    <el-header>
      <h1>{{ title }}</h1>
      <el-menu mode="horizontal" router>
        <el-menu-item index="/streamlist">Список стримов</el-menu-item>
        <el-menu-item v-if="!userId" index="/sign-up">Регистрация</el-menu-item>
        <el-menu-item v-if="!userId" index="/login">Вход</el-menu-item>
        <el-menu-item index="/user">Профиль</el-menu-item>
        <el-menu-item v-if="streamLink !== 0" v-bind:index="streamLink">Стрим</el-menu-item>
        <el-menu-item index="/userlist">Список участников</el-menu-item>
      </el-menu>
    </el-header>

    <router-view/>

    <el-footer>
      <p>{{ currentYear }} &copy; {{ title }}</p>
    </el-footer>
  </el-container>
</template>

<script>
import { db } from '../config/firebase';
import firebase from 'firebase';

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
