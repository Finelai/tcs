<template>
  <el-main class="stream-list">

    <h2>Список стримов, упорядоченный по рейтингу</h2>

    <el-row :gutter="20">
      <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="4" v-for="stream of orderBy(streams, 'raiting', -1)" v-bind:key="stream['.key']">
        <el-card class="stream-card" :body-style="{ padding: '0px', position: 'relative' }">
          <img class="stream-card__preview" :src="stream.settings.preview">
          <el-badge class="stream-card__mark" :value="stream.raiting"/>
          <div class="stream-card__bottom">
            <span class="stream-card__title"><router-link :to="{ name: 'StreamPage', params: { streamLink: stream['.key'] } }">{{ stream.settings.title }}</router-link></span>
            <el-row>
              <el-col class="stream-card__streamername" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                <router-link :to="{ name: 'UserProfile', params: { userId: stream.streamerid } }">{{ stream.streamername }}</router-link>
              </el-col>
              <el-col class="stream-card__follow-button" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                <el-button type="text" @click="followStream">Следить</el-button>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>

  </el-main>
</template>

<script>
import { streamsRef } from '../../config/firebase';

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
    // todo: реализовать follow
    followStream() {
      this.$message({
        message: 'Вы подписались на оповещения о стриме',
        type: 'success',
      });
    },
  },
};
</script>

<style src="../assets/scss/components/stream-list.scss" lang="scss" scoped></style>
