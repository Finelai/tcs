<template>
  <el-main class="user-list">

    <el-switch
        v-model="onlyStreamers"
        active-text="Только стримеры"
        inactive-text="Все">
    </el-switch>

    <h2>Список <span v-if="!onlyStreamers">всех участников</span><span v-else>стримеров</span>, упорядоченный по рейтингу</h2>

    <el-row :gutter="20">
      <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="4" v-if="(!onlyStreamers && !user.streamer) || user.streamer" v-for="user of orderBy(users, 'raiting', -1)" v-bind:key="user['.key']">
        <el-card :body-style="{ padding: '0px', position: 'relative' }">
          <img v-bind:src="user.avatar" class="image">
          <el-badge class="mark" :value="user.raiting"/>
          <div style="padding: 14px;">
            <span><router-link :to="{ name: 'UserProfile', params: { userId: user['.key'] } }">{{ user.name }}</router-link></span>
            <div class="clearfix">
              <span v-if="user.streamer">
                <router-link :to="{ name: 'StreamPage', params: { streamLink: user.streamer } }">Перейти на стрим</router-link>
              </span>
              <el-button type="text" class="button" @click="followUser">Следить</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

  </el-main>
</template>

<script>
import { usersRef } from '../../config/firebase';

export default {
  data() {
    return {
      onlyStreamers: false,
    };
  },
  firebase: {
    // сортируем по рейтингу
    users: usersRef.orderByChild('raiting'),
  },
  methods: {
    // todo: реализовать follow
    followUser() {
      this.$message({
        message: 'Вы подписались на обновления участника',
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
