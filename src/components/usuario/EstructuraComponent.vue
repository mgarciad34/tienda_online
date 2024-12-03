<template>
    <div id="app">
        <v-app>
            <v-app-bar app>
                <v-toolbar flat color="primary">
                    <v-toolbar-title>Usuario</v-toolbar-title>
                    <v-spacer></v-spacer>

                    <v-btn @click="fncTienda()">
                        <v-icon>mdi-store</v-icon>
                    </v-btn>
                    <v-btn @click="fncCarrito()">
                        <v-icon>mdi-cart</v-icon>
                    </v-btn>
                    <v-btn @click="fncUsuario()">
                        <v-icon>mdi-account-circle</v-icon>
                    </v-btn>
                    <v-btn @click="fncCerrar()">
                        <v-icon>mdi-logout</v-icon>
                    </v-btn>

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

                    <template v-if="$route.path === '/usuario/dashboard'">
                        <TiendaComponent v-if="$route.path.includes('/usuario/dashboard')" id="TiendaComponent"
                            style="display: block;" />
                    </template>

                    <template v-if="$route.path === '/usuario/perfil'">
                        <PerfilComponent v-if="$route.path.includes('/usuario/perfil')" id="PerfilComponent"
                            style="display: block;" />
                    </template>

                    <template v-if="$route.path === '/usuario/carrito'">
                        <CarritoComponent v-if="$route.path.includes('/usuario/carrito')" id="CarritoComponent"
                            style="display: block" />
                    </template>

                </v-container>
            </v-main>
        </v-app>
    </div>
</template>

<script>
import axios from 'axios'
import PerfilComponent from './PerfilComponent.vue';
import TiendaComponent from './TiendaComponent.vue';
import CarritoComponent from './CarritoComponent.vue'

export default {
    components: {
        PerfilComponent,
        TiendaComponent,
        CarritoComponent,
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
        fncTienda(){
            this.$router.push({ name: 'usuarioDashboard' });
        },
        fncCarrito(){
            this.$router.push({ name: 'usuarioCarrito' });
        },
        fncUsuario(){
            this.$router.push({ name: 'usuarioPerfil' });
        },
        fncCerrar() {
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
                    sessionStorage.removeItem('id');
                    this.$router.push('/');
                })
                .catch(error => {
                    console.error('Error al cerrar sesión:', error);
                });
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

<style scoped>
.app {
    background-color: black;
}
</style>