<template>
  <v-app>
    <v-container class="pa-0 ma-0">
      <v-row no-gutters>
        <v-col class="d-flex justify-start">
          <v-sheet class="pa-2" style="display: flex; align-items: center;">
            <v-text-field placeholder="Nombre de categoría" style="height: 48px; margin-right:8px; width: 250px;"
              v-model="txtNombreCategoria"></v-text-field>
          </v-sheet>
          <v-btn color="primary" style="height: 48px; margin-right:8px;" @click="fncCrearCategoria">Crear
            Categoria</v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-data-table :headers="headers" :items="items" :loading="loading" :search="search" class="elevation-1">
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.nombre }}</td>
        <td>
          <div class="button-container d-flex justify-center">
            <v-btn style="background-color: yellow" icon @click="fncMostrarModalActualizar(item)">
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

    <!-- Modal para actualizar la categoría -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Actualizar Categoría</span>
        </v-card-title>
        <v-card-text>
          <v-text-field label="Nombre de Categoría" v-model="categoriaSeleccionada.nombre"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="fncActualizarCategoria">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CategoriaComponent',
  data() {
    return {
      dialog: false,
      txtNombreCategoria: '',
      categoriaSeleccionada: {},
      headers: [
        { text: 'Nombre de Categoría', value: 'nombre' },
        { text: 'Acciones', value: 'actions' }
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
    fncMostrarModalActualizar(item) {
      this.categoriaSeleccionada = { ...item };
      this.dialog = true;
    },
    async fncActualizarCategoria() {
      try {
        const token = sessionStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        const response = await axios.put(`http://localhost:8000/api/admin/categorias/${this.categoriaSeleccionada.id}`,
          { nombre: this.categoriaSeleccionada.nombre },
          config);

        const index = this.items.findIndex(item => item.id === this.categoriaSeleccionada.id);
        if (index !== -1) {
          this.items[index] = { ...this.categoriaSeleccionada };
        }
        this.dialog = false;

      } catch (error) {
        console.error('Error al actualizar la categoría:', error.response?.data || error.message);
      }
    },
    async fncEliminarCategoria(item) {
      try {
        const token = sessionStorage.getItem('token');
        await axios.delete(`http://localhost:8000/api/admin/categorias/${item.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const index = this.items.findIndex(cat => cat.id === item.id);
        if (index !== -1) {
          this.items.splice(index, 1);
          this.search = '';
        }
      } catch (error) {
        console.error('Error al eliminar categoría:', error.response?.data || error.message);
      }
    }
  }
};
</script>

<style scoped>
.hidden-column {
  display: none;
}
</style>
