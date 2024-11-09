<template>
    <v-app>
        <v-container class="pa-0 ma-0">
            <v-row no-gutters>
                <v-col class="d-flex justify-start">
                    <v-sheet class="pa-2" style="display: flex; align-items: center;">
                        <v-text-field placeholder="Nombre de categoría"
                            style="height: 48px; margin-right:8px; width: 250px;"
                            v-model="txtNombreCategoria"></v-text-field>
                    </v-sheet>
                    <v-btn color="primary" style="height: 48px; margin-right:8px;" @click="fncCrearCategoria">Crear Categoria</v-btn>
                </v-col>
            </v-row>
        </v-container>

        <v-data-table :headers="headers" :items="items" :loading="loading" :search="search" class="elevation-1">
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
            txtNombreCategoria: '',
            headers: [
                { text: 'ID', value: 'id' },
                { text: 'Nombre de Categoría', value: 'nombre' },
                { text: '', value: '' }
            ],
            items: [],
            loading: true,
            search: ''
        };
    },
    mounted() {
        this.fncObtenerCategorias();
    },
    methods: {
        async fncCrearCategoria() {
            try {
                const token = sessionStorage.getItem('token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };

                const response = await axios.post('http://localhost:8000/api/admin/categorias',
                    { nombre: this.txtNombreCategoria },
                    config);

                console.log('Categoria creada:', response.data);

                this.txtNombreCategoria = '';
                this.items.push(response.data.categoria);

            } catch (error) {
                console.error('Error al crear la categoría:', error.response?.data || error.message);
            }
        },
        async fncObtenerCategorias() {
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
};
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
