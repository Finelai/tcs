<template>
  <div class="stream-list">

    <h2>Список стримов</h2>

    <div>
      <ul>
        <li v-for="stream of streams" v-bind:key="stream['.key']">
          <p>{{ stream.raiting }} | <router-link :to="{ name: 'StreamPage', params: { streamTitle: stream['.key'] } }">{{ stream.settings.title }}</router-link></p>
          <button @click="removeName(stream['.key'])">Удалить стрим</button>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import firebase from 'firebase';
import { streamsRef, db } from '../../config/firebase';

export default {
  data() {
    return {
      stream: '',
    };
  },
  firebase: {
    // сортируем по рейтингу
    streams: streamsRef.orderByChild('raiting'),
  },
  methods: {
    removeName(key) {
      streams.child(key).remove();
    },
  },
};
</script>
