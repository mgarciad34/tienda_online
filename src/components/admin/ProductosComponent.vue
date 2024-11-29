<template>
  <v-container fluid>
    <!-- Botón para abrir el diálogo de creación -->
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
        <v-card class="producto-card" elevation="4" hover>
          <v-carousel :show-arrows="false" height="200px">
            <v-carousel-item v-for="(img, index) in [producto.img1, producto.img2, producto.img3]" :key="index">
              <v-img :src="img" alt="Imagen del producto" class="producto-img" height="200px"></v-img>
            </v-carousel-item>
          </v-carousel>

          <v-card-title class="producto-nombre">{{ producto.nombre }}</v-card-title>

          <v-card-subtitle class="producto-descripcion">
            Existencias: {{ producto.existencias }}
            <br>
            Categoría: {{ producto.categoria_id }}
          </v-card-subtitle>

          <v-card-text class="producto-descripcion">
            {{ producto.descripcion }}
          </v-card-text>

          <v-card-text class="producto-precio">
            {{ producto.precio.toFixed(2) }} €
          </v-card-text>

          <v-row>
            <v-col cols="4">
              <v-btn color="yellow" block><v-icon>mdi-update</v-icon></v-btn>
            </v-col>
            <v-col cols="4">
              <v-btn color="red" @click="fncEliminarProducto(producto.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
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
          <v-text-field v-model="nombreProducto" label="Nombre del Producto" outlined
            :rules="[v => !!v || 'El nombre es obligatorio']"></v-text-field>
          <v-file-input v-model="file1" label="Seleccionar imagen 1" accept="image/*" outlined></v-file-input>
          <v-file-input v-model="file2" label="Seleccionar imagen 2" accept="image/*" outlined></v-file-input>
          <v-file-input v-model="file3" label="Seleccionar imagen 3" accept="image/*" outlined></v-file-input>
          <v-textarea v-model="descripcionProducto" label="Descripción del Producto" outlined rows="3" auto-grow
            :rules="[v => !!v || 'La descripción es obligatoria']"></v-textarea>
          <v-text-field v-model="precioProducto" label="Precio del Producto" outlined type="number" min="0"
            :rules="[v => v > 0 || 'El precio debe ser mayor que 0']"></v-text-field>
          <v-text-field v-model="existenciasProducto" label="Existencias del Producto" outlined type="number" min="0"
            :rules="[v => v >= 0 || 'Las existencias no pueden ser negativas']"></v-text-field>

          <!-- Selector de categoría -->
          <v-select v-model="categoriaProducto" :items="categorias" item-text="nombre" item-value="id" label="Categoría"
            outlined :rules="[v => !!v || 'Debe seleccionar una categoría']">
          </v-select>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn @click="closeDialog">Cerrar</v-btn>
          <v-btn @click="fncInsertarProducto">Insertar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar para mensajes -->
    <v-snackbar v-model="snackbar.visible" :color="snackbar.color">
      {{ snackbar.message }}
    </v-snackbar>
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
      categoriaProducto: null, 
      categorias: [], 
      snackbar: {
        visible: false,
        color: '',
        message: '',
      },
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
        this.error = 'Ha ocurrido un error al cargar los productos';
        this.isLoading = false;
      }
    },
    async fncObtenerCategorias() {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) throw new Error('No se encontró un token válido');

        const response = await axios.get('http://localhost:8000/api/admin/categorias', {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.categorias = response.data.categorias; // Ajusta esto según la respuesta del backend
      } catch (err) {
        console.error('Error al cargar categorías:', err.response?.data || err.message);
        this.showSnackbar('Error al cargar categorías. Por favor, inténtelo nuevamente.', 'error');
      }
    },
    closeDialog() {
      this.dialogInsertar = false;
      this.resetFormulario();
    },
    async fncInsertarProducto() {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) throw new Error('No se encontró un token de autenticación válido');

        const productData = {
          nombre: this.nombreProducto,
          descripcion: this.descripcionProducto,
          precio: this.precioProducto,
          existencias: this.existenciasProducto,
          categoria_id: this.categoriaProducto, // Enviar la categoría seleccionada
        };

        const convertToBase64 = (file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        };

        let img1Base64, img2Base64, img3Base64;

        if (this.file1) {
          img1Base64 = await convertToBase64(this.file1);
          productData.img1 = img1Base64;
        }
        if (this.file2) {
          img2Base64 = await convertToBase64(this.file2);
          productData.img2 = img2Base64;
        }
        if (this.file3) {
          img3Base64 = await convertToBase64(this.file3);
          productData.img3 = img3Base64;
        }

        const instance = axios.create({
          baseURL: 'http://localhost:8000/api',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const response = await instance.post('/admin/productos', productData);
        console.log(response.data);

        this.resetFormulario();
        this.closeDialog();
        this.fncObtenerProductos();
      } catch (err) {
        console.error('Error al insertar el producto:', err.response?.data || err.message);
        this.showSnackbar('Error al insertar el producto. Por favor, inténtelo nuevamente.', 'error');
      }
    },
    async fncEliminarProducto(id) {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) throw new Error('No se encontró un token válido');

        await axios.delete(`/admin/productos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Actualizar el estado local
        this.productos = this.productos.filter((producto) => producto.id !== id);

        // Mostrar mensaje de éxito
        this.showSnackbar('El producto ha sido eliminado con éxito', 'success');
      } catch (error) {
        console.error('Error al eliminar el producto:', error.response?.data || error.message);
        this.showSnackbar('Ha ocurrido un error al eliminar el producto. Por favor, inténtelo nuevamente.', 'error');
      }
    },
    resetFormulario() {
      this.nombreProducto = '';
      this.file1 = null;
      this.file2 = null;
      this.file3 = null;
      this.descripcionProducto = '';
      this.precioProducto = null;
      this.existenciasProducto = null;
      this.categoriaProducto = null;
    },
    showSnackbar(message, color) {
      this.snackbar = { visible: true, color, message };
    },
  },
  mounted() {
    this.fncObtenerProductos();
    this.fncObtenerCategorias(); // Cargar las categorías al montar el componente
  },
};
</script>


<style scoped>
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

.producto-img {
  border-radius: 4px;
}

.v-btn {
  transition: background-color 0.3s ease;
}

.v-btn:hover {
  background-color: #4CAF50;
}

.v-btn.red:hover {
  background-color: #D32F2F;
}

.v-dialog .v-card {
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.v-dialog .v-text-field, .v-dialog .v-textarea, .v-dialog .v-file-input {
  margin-bottom: 20px;
}

.v-snackbar {
  border-radius: 8px;
  font-weight: bold;
  text-align: center;
}

.v-snackbar.v-snackbar--visible {
  transition: all 0.5s ease;
}

.v-icon {
  transition: transform 0.2s ease-in-out;
}

.v-icon:hover {
  transform: scale(1.2);
}
</style>

