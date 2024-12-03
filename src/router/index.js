import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import UsuarioDashboard from '../views/UsuarioDashboard.vue'
import RegistroView from '../views/RegistroView.vue'
import RecuperarView from '@/views/RecuperarView.vue'
import AdminCategorias from '@/views/admin/AdminCategorias.vue'
import AdminProductos from '@/views/admin/AdminProductos.vue'
import UsuarioPerfil from '@/views/usuario/UsuarioPerfil.vue'
import UsuarioCarrito from '@/views/usuario/UsuarioCarrito.vue'
import UsuarioHistorial from '@/views/usuario/UsuarioHistorial.vue'

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
      path: '/admin/dashboard/categorias',
      name: 'adminCategorias',
      component: AdminCategorias
    },
    {
      path: '/admin/dashboard/productos',
      name: 'adminProductos',
      component: AdminProductos
    },
    {
      path: '/usuario/dashboard',
      name: 'usuarioDashboard',
      component: UsuarioDashboard
    },
    {
      path: '/usuario/perfil',
      name: 'usuarioPerfil',
      component: UsuarioPerfil
    },
    {
      path: '/usuario/carrito',
      name: 'usuarioCarrito',
      component: UsuarioCarrito
    },
    {
      path: '/usuario/historial',
      name: 'usuarioHistorial',
      component: UsuarioHistorial
    },
  ]
})

export default router
