<template>
  <div id="app">
    <header>
      <div class="header-wrapper">
        <nav>
          <router-link to="/">Top Comment System</router-link>
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

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
