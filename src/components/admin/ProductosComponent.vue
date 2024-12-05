<template>
  <v-container fluid>
    <v-btn color="primary" @click="dialogInsertar = true" class="mb-4">
      <v-icon>mdi-plus</v-icon> Crear nuevo producto
    </v-btn>

<!--Mostramos los productos-->
    <v-row>
      <v-col  v-for="producto in productos" :key="producto.id" cols="12" sm="6" md="4" lg="3">
        <v-card class="producto-card" elevation="4" hover>
          <v-carousel :show-arrows="false" height="200px">
            <v-carousel-item v-for="(img, index) in [producto.img1, producto.img2, producto.img3]" :key="index">
              <v-img :src="img" alt="Imagen del producto" class="producto-img" height="200px"></v-img>
            </v-carousel-item>
          </v-carousel>

          <v-card-title class="producto-nombre">{{ producto.nombre }}</v-card-title>

          <v-card-subtitle class="producto-descripcion">
            Existencias: {{ producto.existencias }}
          </v-card-subtitle>

          <v-card-text class="producto-descripcion">
            {{ producto.descripcion }}
          </v-card-text>

          <v-card-text class="producto-precio">
            {{ producto.precio.toFixed(2) }} €
          </v-card-text>

          <v-row>
            <v-col cols="4">
              <v-btn color="blue" @click="dialogActualizar = true; fncCargarDatos(producto.id)">
                <v-icon>mdi-update</v-icon>
              </v-btn>

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

    <!--Dialog insertar-->
    <v-dialog v-model="dialogInsertar" width="500" @click:outside="closeDialog">
      <v-card class="modal-container">
        <div class="modal-header">
          <h2>Insertar Nuevo Producto</h2>
          <button @click="closeDialog" class="btn-close">&times;</button>
        </div>

        <div class="modal-body">
          <form class="product-form">
            <div class="form-group">
              <v-text-field v-model="nombreProducto" label="Escribe el nombre del producto" required />
              <div class="file-inputs">
                <v-file-input v-model="file1" label="Seleccionar imagen 1" accept="image/*" outlined></v-file-input>
                <v-file-input v-model="file2" label="Seleccionar imagen 2" accept="image/*" outlined></v-file-input>
                <v-file-input v-model="file3" label="Seleccionar imagen 3" accept="image/*" outlined></v-file-input>
              </div>
              <v-textarea v-model="descripcionProducto" label="Escribe la descripción del producto" required />
              <v-text-field v-model="precioProducto" type="number" label="Escribe el precio del producto" min="0"
                required />
              <v-text-field v-model="existenciasProducto" type="number" label="Escribe las existencias del producto"
                min="0" required />
            </div>

            <div class="custom-select">
              <select id="categoriaProducto" name="categoriaProducto" v-model="categoriaProducto" required>
                <option value="" disabled selected>Selecciona una categoría</option>
                <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
                  {{ categoria.nombre }}
                </option>
              </select>
            </div>
          </form>
        </div>

        <v-col>
          <v-btn color="red" @click="closeDialog">Cerrar</v-btn>
          <v-btn color="green" @click="fncInsertarProducto">Insertar</v-btn>
        </v-col>
      </v-card>
    </v-dialog>

    <!--Dialog Actualizar-->
    <v-dialog v-model="dialogActualizar" width="500" @click:outside="this.dialogActualizar = false;">
      <v-card class="modal-container">
        <div class="modal-header">
          <h2>Actualizar Producto</h2>
          <button @click="this.dialogActualizar = false;" class="btn-close">&times;</button>
        </div>

        <div class="modal-body">
          <form class="product-form">
            <div class="form-group">
              <v-text-field v-model="nombreAProducto" label="Nombre del producto" required />
              <div class="file-inputs">
                <v-file-input v-model="fileA1" label="Seleccionar imagen 1 (Opcional)" accept="image/*" outlined />
                <v-file-input v-model="fileA2" label="Seleccionar imagen 2 (Opcional)" accept="image/*" outlined />
                <v-file-input v-model="fileA3" label="Seleccionar imagen 3 (Opcional)" accept="image/*" outlined />
              </div>
              <v-textarea v-model="descripcionAProducto" label="Descripción del producto" required />
              <v-text-field v-model="precioAProducto" type="number" label="Precio del producto" min="0" required />
              <v-text-field v-model="existenciasAProducto" type="number" label="Existencias del producto" min="0"
                required />
            </div>
            <div class="custom-select">
              <select id="categoriaAProducto" name="categoriaAProducto" v-model="categoriaAProducto" required>
                <option value="" disabled selected>
                  Selecciona una categoría
                </option>
                <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
                  {{ categoria.nombre }}
                </option>
              </select>
            </div>
          </form>
        </div>

        <v-col>
          <v-btn color="red" @click="closeDialog">Cerrar</v-btn>
          <v-btn color="primary" @click="fncActualizarProducto()">Actualizar</v-btn>
        </v-col>
      </v-card>
    </v-dialog>
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
      productoActualizados: [],
      isLoading: true,
      error: null,
      dialogInsertar: false,
      dialogActualizar: false,
      nombreProducto: '',
      file1: null,
      file2: null,
      file3: null,
      descripcionProducto: '',
      precioProducto: null,
      existenciasProducto: null,
      idA: null,
      nombreAProducto: '',
      descripcionAProducto: '',
      precioAProducto: null,
      existenciasAProducto: null,
      categoriaAProducto: null,
      fileA1: null,
      fileA2: null,
      fileA3: null,
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
    async fncCargarDatos(idProducto) {
      try {
        const producto = this.productos.find((producto) => producto.id === idProducto);

        if (!producto) throw new Error('Producto no encontrado');
        this.idA = producto.id;
        this.nombreAProducto = producto.nombre;
        this.descripcionAProducto = producto.descripcion;
        this.precioAProducto = producto.precio;
        this.existenciasAProducto = producto.existencias;
        this.categoriaAProducto = producto.categoria_id;
        this.fileA1 = null;
        this.fileA2 = null;
        this.fileA3 = null;
      } catch (err) {
        console.error('Error al cargar datos del producto:', err.message);
        this.showSnackbar('Error al cargar los datos del producto', 'error');
      }
    },

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

        this.categorias = response.data.categorias;
      } catch (err) {
        console.error('Error al cargar categorías:', err.response?.data || err.message);
        this.showSnackbar('Error al cargar categorías. Por favor, inténtelo nuevamente.', 'error');
      }
    },
    getNombreCategoria(id) {
      const categoria = this.categorias.find((cat) => cat.id === id);
      return categoria ? categoria.nombre : 'Sin categoría';
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
          categoria_id: this.categoriaProducto,
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

        this.resetFormulario();
        this.closeDialog();
        this.fncObtenerProductos();
      } catch (err) {
        console.error('Error al insertar el producto:', err.response?.data || err.message);
        this.showSnackbar('Error al insertar el producto. Por favor, inténtelo nuevamente.', 'error');
      }
    },

    async fncActualizarProducto() {
      try {
        const productData = {};

        const convertToBase64 = (file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        };

        // Obtener datos del producto
        const { idA, nombreAProducto, descripcionAProducto, precioAProducto, existenciasAProducto } = this;

        // Agregar datos al objeto productData
        if (idA) productData.id = idA;
        if (nombreAProducto) productData.nombre = nombreAProducto;
        if (descripcionAProducto) productData.descripcion = descripcionAProducto;
        if (precioAProducto > 0) {
          productData.precio = parseFloat(precioAProducto);
        }
        if (existenciasAProducto) productData.existencias = parseInt(existenciasAProducto);

        // Convertir archivos a base64 si estan
        if (this.fileA1 != null) {
          const img1Base64 = await convertToBase64(this.fileA1);
          productData.img1 = img1Base64;
        }

        if (this.fileA2 != null) {
          const img2Base64 = await convertToBase64(this.fileA2);
          productData.img2 = img2Base64;
        }

        if (this.fileA != null) {
          const img3Base64 = await convertToBase64(this.fileA3);
          productData.img3 = img3Base64;
        }

        const token = sessionStorage.getItem('token');
        if (!token) throw new Error('No se encontró un token válido');

        const instance = axios.create({
          baseURL: 'http://localhost:8000/api',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        await instance.put(`/admin/productos/${idA}`, productData);
        this.productos = this.productos.filter((producto) => producto.id !== idA);
        this.showSnackbar('El producto ha sido actualizado con éxito', 'success');
        this.resetFormulario();
        this.dialogActualizar = false;
        this.fncObtenerProductos();
      } catch (error) {
        console.error('Error al actualizar el producto:', error.response?.data || error.message);
        this.showSnackbar(
          error.response?.data?.message || 'Ha ocurrido un error al actualizar el producto',
          'error'
        );
      }
    },

    async fncEliminarProducto(id) {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) throw new Error('No se encontró un token válido');

        const instance = axios.create({
          baseURL: 'http://localhost:8000/api',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const response = await instance.delete(`/admin/productos/${id}`);
        this.productos = this.productos.filter((producto) => producto.id !== id);
        this.showSnackbar('El producto ha sido eliminado con éxito', 'success');
      } catch (error) {
        console.error('Error al eliminar el producto:', error.response?.data || error.message);
        this.showSnackbar(
          error.response?.data?.message || 'Ha ocurrido un error al eliminar el producto',
          'error'
        );
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
    this.fncObtenerCategorias();
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

.v-dialog .v-text-field,
.v-dialog .v-textarea,
.v-dialog .v-file-input {
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

.modal-header {
  padding: 15px;
  display: flex;
  justify-content: space-between;
}

.modal-body {
  padding: 20px 10px;
}

.form-control {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-input {
  margin-bottom: 10px;
}

.form-select {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn-close {
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #4AAE9B;
}

.btn-secondary {
  background-color: #f8f9fa;
  color: #6b7280;
  border: 1px solid #d1d5e8;
}

.btn-primary {
  background-color: #4AAE9B;
  color: white;
  border: none;
  padding: 10px 20px;
  font-weight: bold;
  cursor: pointer;
}

.custom-select {
  position: relative;
  width: 100%;
}

.custom-select select {
  appearance: none;
  width: 100%;
  padding: 10px 20px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #333;
  cursor: pointer;
  font-size: 16px;
}

.custom-select select::-webkit-scrollbar {
  display: none;
}

.custom-select select {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.custom-select::after {
  content: '\25BC';
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #333;
}

.custom-select:hover {
  background-color: #e0e0e0;
}

.custom-select select:focus {
  outline: none;
  border-color: #000000;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
}
</style>
