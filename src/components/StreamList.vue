<template>
  <el-main class="stream-list">

    <h2>Список стримов, упорядоченный по рейтингу</h2>

    <el-row :gutter="20">
      <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="4" v-for="stream of orderBy(streams, 'raiting', -1)" v-bind:key="stream['.key']">
        <el-card :body-style="{ padding: '0px', position: 'relative' }">
          <img src="http://via.placeholder.com/320x180" class="image">
          <el-badge class="mark" :value="stream.raiting"/>
          <div style="padding: 14px;">
            <span><router-link :to="{ name: 'StreamPage', params: { streamLink: stream['.key'] } }">{{ stream.settings.title }}</router-link></span>
            <div class="clearfix">
              <span>
                <router-link :to="{ name: 'UserProfile', params: { userId: stream.streamerid } }">{{ stream.streamername }}</router-link>
              </span>
              <el-button type="text" class="button" @click="followStream">Следить</el-button>
            </div>
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

<style>
  .button {
    padding: 0;
    float: right;
  }

  .mark {
    position: absolute;
    top: 20px;
    transform: translateY(-50%) translateX(30%);
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }

  .clearfix:after {
      clear: both
  }
</style>
