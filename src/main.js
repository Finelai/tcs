/* eslint-disable */

import Vue from 'vue';

// element
import { Button, Message } from 'element-ui';
import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';

locale.use(lang);

import '../config/firebase';
import firebase from 'firebase';
import VueFire from 'vuefire';

import App from './App';
import router from './router';

import Vue2Filters from 'vue2-filters';

Vue.component(Button.name, Button)
Vue.prototype.$message = Message;

Vue.use(VueFire);
Vue.use(Vue2Filters);
Vue.config.productionTip = false;

let app;

firebase.auth().onAuthStateChanged(function(user) {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      components: { App },
      template: '<App/>',
    });
  }
});