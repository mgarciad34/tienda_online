<template>
  <v-container class="productos-container" fluid>
    <v-btn color="green" @click="dialogInsertar = true">
      <v-icon>mdi-plus</v-icon> Crear nuevo producto
    </v-btn>
    <v-row>
      <v-col cols="12" v-if="isLoading">
        <v-alert type="info" text>
          Cargando productos...
        </v-alert>
      </v-col>

      <v-col cols="12" v-else-if="error">
        <v-alert type="error" text>
          {{ error }}
        </v-alert>
      </v-col>

      <v-col v-else v-for="producto in productos" :key="producto.id" cols="12" sm="6" md="4" lg="3">
        <v-card class="producto-card" elevation="2">
          <v-carousel :show-arrows="false" height="200px">
            <v-carousel-item v-for="(img, index) in [producto.img1, producto.img2, producto.img3]" :key="index">
              <v-img :src="img" alt="Imagen del producto" class="producto-img" height="200px"></v-img>
            </v-carousel-item>
          </v-carousel>

          <v-card-title class="producto-nombre">{{ producto.nombre }}</v-card-title>

          <v-card-subtitle class="producto-descripcion">
            Categoria {{ producto.categoria_id }}
          </v-card-subtitle>

          <v-card-text class="producto-descripcion">
            {{ producto.descripcion }}
          </v-card-text>

          <v-card-text class="producto-precio">
            $ {{ producto.precio.toFixed(2) }}
          </v-card-text>

          <v-card-text class="producto-stock">
            Existencias: {{ producto.existencias }}
          </v-card-text>

          <v-btn color="blue"><v-icon>mdi-eye</v-icon></v-btn>
          <v-btn color="yellow"><v-icon>mdi-update</v-icon></v-btn>
          <v-btn color="red"><v-icon>mdi-delete</v-icon></v-btn>
        </v-card>
      </v-col>
    </v-row>
    <!-- Modal Insertar -->
    <v-dialog v-model="dialogInsertar" width="500" @click:outside="closeDialog">
      <v-card>
        <v-card-title>Insertar Nuevo Producto</v-card-title>
        <v-card-text>
          <v-text-field v-model="nombreProducto" label="Nombre del Producto" outlined></v-text-field>

          <v-file-input v-model="file1" label="Seleccionar imagen" accept="image/*" outlined></v-file-input>
          <v-file-input v-model="file2" label="Seleccionar imagen" accept="image/*" outlined></v-file-input>
          <v-file-input v-model="file3" label="Seleccionar imagen" accept="image/*" outlined></v-file-input>
          <v-textarea v-model="descripcionProducto" label="Descripción del Producto" outlined rows="3" auto-grow></v-textarea>
          <v-text-field v-model="precioProducto" label="Precio del Producto" outlined type="number" min="0"></v-text-field>
          <v-text-field v-model="existenciasProducto" label="Existencias del Producto" outlined type="number" min="0"></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn @click="closeDialog">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Fin Modal Insertar-->
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      productos: [],
      isLoading: true,
      error: null,
      dialogInsertar: false,
      nombreProducto: '',
      file1: null,
      file2: null,
      file3: null,
      descripcionProducto: '',
      precioProducto: null,
      existenciasProducto: null,
    };
  },
  methods: {
    async fncObtenerProductos() {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) throw new Error('No se encontró un token válido');

        const response = await axios.get('http://localhost:8000/api/admin/productos', {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.productos = response.data.productos;
        this.isLoading = false;
      } catch (err) {
        console.error('Error al obtener productos:', err);
        this.error = 'Ha ocurrido un error al cargar los productos';
        this.isLoading = false;
      }
    },
    closeDialog() {
      this.dialogInsertar = false;
    },
  },
  mounted() {
    this.fncObtenerProductos();
  },
};
</script>

<style scoped>
.productos-container {
  max-width: 1200px;
  margin: 0 auto;
}

.producto-card {
  padding: 15px;
  transition: transform 0.2s ease-in-out;
}

.producto-card:hover {
  transform: scale(1.05);
}

.producto-nombre {
  font-size: 1.2em;
  font-weight: bold;
  color: #333;
  margin: 10px 0;
}

.producto-descripcion {
  color: #555;
  font-size: 0.9em;
  margin: 5px 0;
}

.producto-precio {
  font-size: 1.1em;
  font-weight: bold;
  color: #1e88e5;
  margin: 10px 0;
}

.producto-stock {
  font-size: 0.9em;
  color: #666;
}
</style>
