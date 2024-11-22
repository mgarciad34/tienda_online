<template>
    <div id="app">
      <v-app>
        <v-app-bar app>
          <v-toolbar flat style="background-color:#FFB300;">
            <v-toolbar-title>Administrador Tienda Online</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu bottom left>
              <template v-slot:activator="{ props }">
                <v-btn icon v-bind="props">
                  <v-icon>mdi-menu</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item v-for="(link, index) in links" :key="index" :title="link[0]"
                  :prepend-icon="getIcon(link[0])" @click="fncOpciones(index)" link></v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-app-bar>
  
        <v-main style="background-color: #FAFAFA;">
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <v-navigation-drawer v-model="drawer" temporary fixed>
                  <v-list>
                    <!-- Aquí irán los elementos del drawer -->
                    <v-list-item v-for="(item, index) in items" :key="index" :to="item.to" router exact>
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-navigation-drawer>
              </v-col>
            </v-row>
  
            <!-- Usando una propiedad computada para determinar qué componente renderizar -->
            <template v-if="$route.path.includes('/admin/dashboard')">
              <OpcionesComponent v-if="$route.path.includes('/admin/dashboard')" id="OpcionesComponent" style="display: block;" />
              <CategoriaComponent v-if="$route.path.includes('/admin/dashboard/categorias')" id="CategoriaComponent" style="display: block;" />
              <ProductosComponent v-if="$route.path.includes('/admin/dashboard/productos')" id="ProductosComponent" style="display: block" />
            </template>
          </v-container>
        </v-main>
      </v-app>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  import CategoriaComponent from './CategoriaComponent.vue';
  import ProductosComponent from './ProductosComponent.vue';
  import OpcionesComponent from './OpcionesComponent.vue';

  export default {
    components: {
      CategoriaComponent,
      ProductosComponent,
      OpcionesComponent
    },
    data() {
      return {
        drawer: false,
        items: [
          { title: 'Inicio', to: '/' },
          { title: 'Perfil', to: '/perfil' },
          { title: 'Configuración', to: '/configuracion' },
        ],
        links: [
          ['Categoria', 'mdi-folder'],
          ['Productos', 'mdi-cart'],
          ['Cerrar Sesión', 'mdi-logout']
        ]
      }
    },
    computed: {
      isCategoriasRoute() {
        return this.$route.path.includes('/admin/dashboard/categorias');
      }
    },
    methods: {
      fncOpciones(index) {
        const token = sessionStorage.getItem('token')
  
        switch (index) {
          case 0:
            this.$router.push({ name: 'adminCategorias' })
            break;
  
          case 1:
            this.$router.push({ name: 'adminProductos' })
            break;
  
          case 2:
            axios.post('http://localhost:8000/api/logout', null, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
              .then(response => {
                console.log('Sesión cerrada:', response.data);
                sessionStorage.removeItem('correo');
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('rol');
                this.$router.push('/');
              })
              .catch(error => {
                console.error('Error al cerrar sesión:', error);
              });
            break;
  
          default:
            break;
        }
      },
      getIcon(iconName) {
        switch (iconName) {
          case 'Categoria':
            return 'mdi-folder'
          case 'Productos':
            return 'mdi-cart'
          case 'Cerrar Sesión':
            return 'mdi-logout'
          default:
            return ''
        }
      }
    }
  }
  </script>
  