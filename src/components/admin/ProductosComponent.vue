<template>
  <v-container class="productos-container" fluid>
    <v-btn color="green">
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
            <v-carousel-item
              v-for="(img, index) in [producto.img1, producto.img2, producto.img3]"
              :key="index"
            >
              <v-img
                :src="img"
                alt="Imagen del producto"
                class="producto-img"
                height="200px"
              ></v-img>
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
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const productos = ref([]);
    const isLoading = ref(true);
    const error = ref(null);

    const fncObtenerProductos = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) throw new Error('No se encontró un token válido');

        const response = await axios.get('http://localhost:8000/api/admin/productos', {
          headers: { Authorization: `Bearer ${token}` },
        });
        productos.value = response.data.productos;
        isLoading.value = false;
      } catch (err) {
        console.error('Error al obtener productos:', err);
        error.value = 'Ha ocurrido un error al cargar los productos';
        isLoading.value = false;
      }
    };

    onMounted(() => {
      fncObtenerProductos();
    });

    return {
      productos,
      isLoading,
      error,
    };
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
