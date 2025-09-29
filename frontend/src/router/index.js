import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/login'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
  ],
})

// Verificar estado de autenticación antes de cada navegación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Verificar si ya tenemos información de autenticación guardada
  authStore.checkAuthStatus()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.name === 'login' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
