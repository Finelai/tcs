/* eslint-disable */

import Vue from 'vue';
import vueJsonp from 'vue-jsonp';

import '../config/firebase';
import VueFire from 'vuefire';

import App from './App';
import router from './router';

import Toaster from 'v-toaster';
import 'v-toaster/dist/v-toaster.css'

Vue.use(VueFire);
Vue.use(Toaster, {timeout: 3000});
Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  vueJsonp,
  components: { App },
  template: '<App/>',
})
