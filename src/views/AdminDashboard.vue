<template>
    <v-app id="inspire">
        <v-navigation-drawer v-model="drawer">
            <v-sheet class="pa-4" color="grey-lighten-4">
                <v-avatar class="mb-4" color="grey-darken-1" size="64"></v-avatar>
                <div>{{ correo }}</div>
            </v-sheet>

            <v-divider></v-divider>

            <v-list>
                <v-list-item v-for="(link, index) in links" :key="index" :title="link[0]"
                    :prepend-icon="getIcon(link[0])" @click="fncCerrarSesion(index)" link></v-list-item>
            </v-list>
        </v-navigation-drawer>
    </v-app>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router';

const router = useRouter();
const correo = sessionStorage.getItem('correo');
const links = [
    ['Categorias', 'mdi-folder'],
    ['Productos', 'mdi-cart'],
    ['Cerrar Sesión', 'mdi-power']
];

const drawer = ref(null);

function getIcon(text) {
    switch (text.toLowerCase()) {
        case 'categorias':
            return 'mdi-folder';
        case 'productos':
            return 'mdi-cart';
        case 'cerrar sesión':
            return 'mdi-power';
        default:
            return 'mdi-help-circle-outline';
    }
}

function fncCerrarSesion(index) {
    const token = sessionStorage.getItem('token')
    console.log(index)
    if (index === links.length - 1) {
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
                router.push('/');
            })
        .catch(error => {
                console.error('Error al cerrar sesión:', error);
            });
    }
}
</script>
