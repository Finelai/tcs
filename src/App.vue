<template>
  <div id="app">
    <header>
      <div class="header-wrapper">
        <nav>
          <router-link :to="{ name: 'StreamPage' }">Stream Page</router-link>
          <router-link :to="{ name: 'SignUp' }">SignUp</router-link>
          <router-link :to="{ name: 'Login' }">Login</router-link>
          <router-link :to="{ name: 'UserProfile' }">Profile</router-link>
          <router-link :to="{ name: 'ComponentForm' }">Comment Form</router-link>
        </nav>
      </div>
    </header>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>
