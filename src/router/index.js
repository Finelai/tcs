import Vue from 'vue';
import Router from 'vue-router';
import firebase from 'firebase';
import Login from '@/components/Login';
import SignUp from '@/components/SignUp';
import UserProfile from '@/components/UserProfile';
import UserList from '@/components/UserList';
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
      path: '/user/:userId',
      name: 'UserProfile',
      component: UserProfile,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/userlist/',
      name: 'UserList',
      component: UserList,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/form',
      name: 'ComponentForm',
      component: ComponentForm,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  // Check if firebase detect user id
  const currentUser = firebase.auth().currentUser;
  // Check if current link auth required
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  // Check auth required and this is not a user - > redirect to login
  if (requiresAuth && !currentUser) {
    next('login');
  } else if (!requiresAuth && currentUser) {
    router.push({ name: 'UserProfile', params: { userId: currentUser.uid } });
  } else {
    next();
  }
});

export default router;
