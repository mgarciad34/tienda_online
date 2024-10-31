<template>
    <v-app>
        <v-toolbar flat color="white">
            <v-btn color="primary" elevation="0">Crear Categoría</v-btn>
        </v-toolbar>

        <v-data-table :headers="headers.text" :items="items" :loading="loading" :search="search" class="elevation-1">
            <template v-slot:item="{ item }">
                <tr>
                    <td>{{ item.id }}</td>
                    <td>{{ item.nombre }}</td>
                    <td>
                        <div class="button-container d-flex justify-center">
                            <v-btn style="background-color: yellow" icon @click="fncActualizarCategoria(item)">
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                            <v-btn style="background-color: red;" icon @click="fncEliminarCategoria(item)">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </div>
                    </td>
                </tr>
            </template>
        </v-data-table>
    </v-app>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            headers: [
                { text: 'ID', value: 'id' },
                { text: 'Nombre de Categoría', value: 'nombre' },
                { text: '', value: '' } 
            ],
            items: [],
            loading: true,
            search: ''
        }
    },
    filters: {
        formatDate(date) {
            if (!date) return date;
            const [year, month, day] = date.split('-');
            return `${day}/${month}/${year}`;
        }
    },
    mounted() {
       this.fncObtenerCategorias();
    },
    methods: {
        async fncObtenerCategorias(){
            try {
            const token = sessionStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            const response = await axios.get('http://localhost:8000/api/admin/categorias', config);
            this.items = response.data.categorias;
            this.loading = false;
        } catch (error) {
            console.error('Error fetching categories:', error);
            this.loading = false;
        }
        },
        fncActualizarCategoria(item) {
            console.log('Editar categoría:', item);
        },
        fncEliminarCategoria(item) {
            console.log('Eliminar categoría:', item);
            axios.delete(`http://localhost:8000/api/admin/categorias/${item.id}`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            })
                .then(response => {
                    const index = this.items.findIndex(cat => cat.id === item.id);
                    if (index !== -1) {
                        this.items.splice(index, 1);
                        this.search = '';
                    }
                })
                .catch(error => {
                    console.error('Error al eliminar categoría:', error.response?.data || error.message);
                });
        }
    }
}
</script>

<style scoped>
.button-container {
    width: 100%;
}

.button-container .v-btn {
    margin-right: 4px !important;
}

.button-container .v-btn:last-child {
    margin-left: 4px !important;
}
</style>
