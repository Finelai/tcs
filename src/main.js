/* eslint-disable */

import Vue from 'vue';
import vueJsonp from 'vue-jsonp';

import '../config/firebase';
import firebase from 'firebase';
import VueFire from 'vuefire';

import App from './App';
import router from './router';

import Toaster from 'v-toaster';
import 'v-toaster/dist/v-toaster.css'

Vue.use(VueFire);
Vue.use(Toaster, {timeout: 3000});
Vue.config.productionTip = false;

let app;

firebase.auth().onAuthStateChanged(function(user) {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      vueJsonp,
      components: { App },
      template: '<App/>',
    });
  }
});