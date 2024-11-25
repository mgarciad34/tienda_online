<template>
  <v-container fluid>
    <!-- Botón para crear un nuevo producto -->
    <v-btn color="green" @click="dialogInsertar = true" class="mb-4">
      <v-icon>mdi-plus</v-icon> Crear nuevo producto
    </v-btn>

    <!-- Cargando productos o mostrando productos -->
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
        <!-- Tarjeta del producto -->
        <v-card class="producto-card" elevation="4" hover>
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

          <!-- Botones de acción -->
          <v-row>
            <v-col cols="4">
              <v-btn color="blue" block><v-icon>mdi-eye</v-icon></v-btn>
            </v-col>
            <v-col cols="4">
              <v-btn color="yellow" block><v-icon>mdi-update</v-icon></v-btn>
            </v-col>
            <v-col cols="4">
              <v-btn color="red" block><v-icon>mdi-delete</v-icon></v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal Insertar Producto -->
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
/* Aseguramos que todo el contenedor ocupe el ancho completo */
.productos-container {
  max-width: 100%;
  padding: 20px;
}

.producto-card {
  padding: 20px;
  border-radius: 8px;
  transition: transform 0.2s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.producto-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}

.producto-nombre {
  font-size: 1.1em;
  font-weight: bold;
  color: #333;
  margin: 8px 0;
}

.producto-descripcion {
  font-size: 0.9em;
  color: #555;
  margin: 4px 0;
}

.producto-precio {
  font-size: 1.1em;
  font-weight: bold;
  color: #388E3C;
  margin: 10px 0;
}

.producto-stock {
  font-size: 0.9em;
  color: #666;
}

.producto-img {
  border-radius: 4px;
}

.v-btn {
  transition: background-color 0.3s ease;
}

.v-btn:hover {
  background-color: #4CAF50;
}
</style>
