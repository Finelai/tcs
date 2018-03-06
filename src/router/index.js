import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/Login';
import SignUp from '@/components/SignUp';
import UserProfile from '@/components/UserProfile';
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
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: SignUp,
    },
    {
      path: '/user',
      name: 'UserProfile',
      component: UserProfile,
    },
    {
      path: '/form',
      name: 'ComponentForm',
      component: ComponentForm,
    },
  ],
});
