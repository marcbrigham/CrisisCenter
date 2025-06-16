import { createRouter, createWebHistory } from 'vue-router'
import CrisisDashboard from '@/views/CrisisDashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: CrisisDashboard,
    },
  ],
})

export default router
