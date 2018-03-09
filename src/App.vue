<template>
  <div id="app">
    <h1>{{ title }}</h1>
    <header>
      <div class="header-wrapper">
        <nav>
          <router-link :to="{ name: 'StreamPage' }">Stream Page</router-link>
          <router-link :to="{ name: 'SignUp' }">Регистрация</router-link>
          <router-link :to="{ name: 'Login' }">Вход</router-link>
          <router-link :to="{ name: 'UserProfile' }">Профиль</router-link>
          <router-link :to="{ name: 'UserList' }">Список участников</router-link>
          <router-link :to="{ name: 'ComponentForm' }">Comment Form</router-link>
        </nav>
      </div>
    </header>

    <router-view/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Tom Comment System',
    };
  },
};
</script>
