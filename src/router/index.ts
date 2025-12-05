import { createRouter, createWebHistory } from 'vue-router';
import IndexPage from '@/pages/IndexPage.vue';
import HomePage from '@/pages/HomePage.vue';
import ProfilePage from '@/pages/ProfilePage.vue';
import AttendancePage from '@/pages/AttendancePage.vue';
import { useUserStore } from '@/stores/user';

export const routes = [
  {
    path: '/',
    name: 'loading',
    component: IndexPage,
    meta: { requiresAuth: false }
  },
  {
    path: "/home",
    name: 'home',
    component: HomePage,
    meta: { requiresAuth: true }
  },
  {
    path: "/profile",
    name: 'profile',
    component: ProfilePage,
    meta: { requiresAuth: true }
  },
  {
    path: "/attendance",
    name: 'attendance',
    component: AttendancePage,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard to protect routes
router.beforeEach((to, from, next) => {
  // Allow access to loading page always
  if (!to.meta.requiresAuth) {
    next();
    return;
  }

  // For protected routes, check if user is authenticated
  const userStore = useUserStore();
  
  if (userStore.isAuthenticated) {
    next();
  } else {
    // Redirect to loading page if user not authenticated
    next({ name: 'loading' });
  }
});

export default router;
