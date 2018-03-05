import Vue from 'vue';
import Router from 'vue-router';
import StreamPage from '@/components/StreamPage';
import ComponentForm from '@/components/ComponentForm';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'StreamPage',
      component: StreamPage,
    },
    {
      path: '/form',
      name: 'ComponentForm',
      component: ComponentForm,
    },
  ],
});
