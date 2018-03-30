<template>
  <el-main class="user-list">

    <el-switch
        v-model="onlyStreamers"
        active-text="Только стримеры"
        inactive-text="Все">
    </el-switch>

    <h2>Список <span v-if="!onlyStreamers">всех участников</span><span v-else>стримеров</span>, упорядоченный по рейтингу</h2>

    <el-row :gutter="20">
      <transition-group name="slide-top">
        <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="3" v-if="(!onlyStreamers && !user.streamer) || user.streamer" v-for="user of orderBy(users, 'raiting', -1)" v-bind:key="user['.key']">
          <el-card class="user-card" :body-style="{ padding: '0px', position: 'relative' }">
            <img class="user-card__avatar" v-bind:src="user.avatar">
            <el-badge class="user-card__raiting" :value="user.raiting"/>
            <div v-if="user.status === 'offline'" class="user-card__status user-card__status--offline">.</div>
            <div v-else class="user-card__status user-card__status--online">.</div>
            <div class="user-card__bottom">
              <span class="user-card__name"><router-link :to="{ name: 'UserProfile', params: { userId: user['.key'] } }">{{ user.name }}</router-link></span>
              <el-row>
                <el-col class="user-card__stream" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                  <span v-if="user.streamer">
                    <router-link  :to="{ name: 'StreamPage', params: { streamLink: user.streamer } }">Cтрим</router-link>
                  </span>
                  <pre v-else></pre>
                </el-col>
                <el-col class="user-card__follow-button" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                  <el-button type="text" @click="followUser(user.name)">Следить</el-button>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </transition-group>
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
    followUser(name) {
      this.$message({
        message: `Вы подписались на обновления участника ${name}`,
        type: 'success',
      });
    },
  },
};
</script>

<style src="../assets/scss/components/user-list.scss" lang="scss" scoped></style>
