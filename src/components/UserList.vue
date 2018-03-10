<template>
  <div class="user-list">

    <h2>Список Пользователей</h2>

    <div>
      <label>Имя</label>
      <input type="text" v-model="name">
      <button @click="submitName()">Добавить участника</button>
    </div>

    <div>
      <p><span @click="onlyStreamers = false">Все пользователи</span> / <span @click="onlyStreamers = true">Стримеры</span></p>
      <ul>
        <li v-if="(!onlyStreamers && !userName.streamer) || userName.streamer" v-for="userName of users" v-bind:key="userName['.key']">
          <p>
            {{ userName.raiting }} |
            <img width="100" height="100" v-bind:src="userName.avatar"> |
            <router-link :to="{ name: 'UserProfile', params: { userId: userName['.key'] } }">{{ userName.name }}</router-link>
            <span v-if="userName.streamer">|
              <router-link :to="{ name: 'StreamPage', params: { streamLink: userName.streamer } }">Перейти на стрим</router-link>
            </span>
          </p>
          <button @click="removeName(userName['.key'])">Удалить</button>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import firebase from 'firebase';
import { usersRef, db } from '../../config/firebase';

export default {
  data() {
    return {
      name: '',
      onlyStreamers: false,
    };
  },
  firebase: {
    // сортируем по рейтингу
    users: usersRef.orderByChild('raiting'),
  },
  methods: {
    submitName() {
      // this.$firebaseRefs.users.push({
      //   name: this.name,
      //   edit: false,
      //   raiting: 0,
      //   id: firebase.auth().currentUser.uid,
      // });
      const postData = {
        name: this.name,
        id: firebase.auth().currentUser.uid,
        raiting: 0,
      };

      let updates = {};
      updates[`/users/${postData.id}`] = postData;

      this.name = '';
      this.$toaster.success('New user added to database.');
      return db.ref().update(updates);
    },
    removeName(key) {
      usersRef.child(key).remove();
    },
    saveEdit(person) {
      const key = person['.key'];
      usersRef.child(key).set({ name: person.name, edit: false });
    },
  },
};
</script>
