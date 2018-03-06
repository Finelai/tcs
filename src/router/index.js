import Vue from 'vue';
import Router from 'vue-router';
import firebase from 'firebase';
import Login from '@/components/Login';
import SignUp from '@/components/SignUp';
import UserProfile from '@/components/UserProfile';
import StreamPage from '@/components/StreamPage';
import ComponentForm from '@/components/ComponentForm';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/login',
    },
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/stream',
      name: 'StreamPage',
      component: StreamPage,
      meta: {
        requiresAuth: true,
      },
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
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/form',
      name: 'ComponentForm',
      component: ComponentForm,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) next('login')
  else if (!requiresAuth && currentUser) next('user')
  else next()
});

export default router;
