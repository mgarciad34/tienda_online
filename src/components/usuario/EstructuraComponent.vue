<template>
    <v-app-bar color="primary" dark>
        <v-toolbar-title class="text-h5 font-weight-bold">
            Mi Tienda Online
        </v-toolbar-title>

        <v-spacer></v-spacer>
        <v-btn icon @click="pantallaCompra()">
            <v-icon>mdi-store-search-outline</v-icon>
        </v-btn>
        <v-btn icon @click="pantallaCarrito()">
            <v-icon>mdi-cart</v-icon>
        </v-btn>
        <v-btn icon @click="pantallaPerfil()">
            <v-icon>mdi-account-circle</v-icon>
        </v-btn>
        <v-btn icon @click="cerrarSesion()">
            <v-icon color="white">mdi-logout</v-icon>
        </v-btn>
    </v-app-bar>
</template>

<script>
import axios from 'axios';

export default {
    name: "HeaderComponent",
    data() {
        return {
        }
    },
    methods: {
        cerrarSesion() {
            const token = sessionStorage.getItem('token')
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
        },

        pantallaPerfil(){
            this.$router.push('/usuario/perfil');
        },

        pantallaCarrito(){
            this.$router.push('/usuario/carrito');
        },
        pantallaCompra(){
            this.$router.push('/usuario/dashboard');
        }

    }
}

</script>