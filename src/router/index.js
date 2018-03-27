import Vue from 'vue';
import Router from 'vue-router';
import firebase from 'firebase';
import Login from '@/components/Login';
import SignUp from '@/components/SignUp';
import UserProfile from '@/components/UserProfile';
import UserList from '@/components/UserList';
import StreamPage from '@/components/StreamPage';
import StreamList from '@/components/StreamList';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/streamlist',
    },
    {
      path: '/',
      redirect: '/streamlist',
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
      path: '/user/:userId',
      name: 'UserProfile',
      component: UserProfile,
    },
    {
      path: '/userlist',
      name: 'UserList',
      component: UserList,
    },
    {
      path: '/stream/:streamLink',
      name: 'StreamPage',
      component: StreamPage,
    },
    {
      path: '/streamlist',
      name: 'StreamList',
      component: StreamList,
    },
  ],
});

export default router;
