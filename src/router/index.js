import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../store/userStore';

import Home from '../views/Home.vue';
import History from '../views/History.vue';
import TransactionForm from '../views/TransactionForm.vue';
import Profile from '../views/Profile.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';

// New Phase 4 Views
const Race = () => import('../views/Race.vue');
const Summary = () => import('../views/Summary.vue');

const routes = [
  { path: '/login', component: Login, meta: { public: true } },
  { path: '/register', component: Register, meta: { public: true } },
  { path: '/', component: Home },
  { path: '/history', component: History },
  { path: '/transaction/add', component: TransactionForm },
  { path: '/transaction/edit/:id', component: TransactionForm },
  { path: '/profile', component: Profile },
  { path: '/race', component: Race },
  { path: '/summary', component: Summary },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (!to.meta.public && !userStore.isLoggedIn) {
    next('/login');
  } else if (to.path === '/login' && userStore.isLoggedIn) {
    next('/');
  } else {
    next();
  }
});

export default router;
