import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('../views/History.vue'),
  },
  {
    path: '/transaction/add',
    name: 'AddTransaction',
    component: () => import('../views/TransactionForm.vue'),
  },
  {
    path: '/transaction/edit/:id',
    name: 'EditTransaction',
    component: () => import('../views/TransactionForm.vue'),
    props: true,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
