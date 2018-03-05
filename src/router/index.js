import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import ComponentForm from '@/components/ComponentForm';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
    },
    {
      path: '/form',
      name: 'ComponentForm',
      component: ComponentForm,
    },
  ],
});
