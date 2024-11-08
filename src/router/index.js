import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import UsuarioDashboard from '../views/UsuarioDashboard.vue'
import RegistroView from '../views/RegistroView.vue'
import RecuperarView from '@/views/RecuperarView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/recuperar',
      name: 'recuperar',
      component: RecuperarView
    },
    {
      path: '/registro',
      name: 'registro',
      component: RegistroView
    },
    {
      path: '/admin/dashboard',
      name: 'adminDashboard',
      component: AdminDashboard
    },
    {
      path: '/usuario/dashboard',
      name: 'usuarioDashboard',
      component: UsuarioDashboard
    },
  ]
})

export default router
