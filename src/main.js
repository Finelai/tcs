// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import vueJsonp from 'vue-jsonp';
import firebase from 'firebase';
import App from './App';
import router from './router';
import FirebaseConfig from '../config/firebase';

Vue.config.productionTip = false;

firebase.initializeApp(FirebaseConfig);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  vueJsonp,
  components: { App },
  template: '<App/>',
});
