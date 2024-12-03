<template>
    <div class="store-container">
        <!-- Toolbar -->
        <div class="toolbar">
            <div class="search-input-container">
                <input v-model="searchQuery" type="text" placeholder="Buscar productos" class="search-bar"
                    @input="filterProducts()">
            </div>
              
        </div>

        <!-- Lista de recomendaciones -->
        <div class="recommendations">
            <h2>Recomendaciones para ti</h2>
            <div v-if="recomendaciones.length > 0" class="product-grid">
                <div v-for="product in recomendaciones" :key="product.id" class="product-card">
                    <v-carousel :show-arrows="false" height="200px">
                        <v-carousel-item v-for="(img, index) in [product.img1, product.img2, product.img3]"
                            :key="index">
                            <v-img :src="img" alt="Imagen del producto" class="producto-img" height="200px"></v-img>
                        </v-carousel-item>
                    </v-carousel>

                    <h3>{{ product.nombre }}</h3>
                    <p class="price">{{ product.precio.toFixed(2) }} €</p>
                    <button @click="addToCart(product)" class="add-to-cart">Añadir al carrito</button>
                </div>
            </div>
            <div v-else class="no-results">
                No hay recomendaciones disponibles.
            </div>
        </div>

        <!-- Lista de productos -->
        <div class="products">
            <h2>Lista de productos</h2>
            <div v-if="filteredProducts.length > 0" class="product-grid">
                <div v-for="product in filteredProducts" :key="product.id" class="product-card">
                    <v-carousel :show-arrows="false" height="200px">
                        <v-carousel-item v-for="(img, index) in [product.img1, product.img2, product.img3]"
                            :key="index">
                            <v-img :src="img" alt="Imagen del producto" class="producto-img" height="200px"></v-img>
                        </v-carousel-item>
                    </v-carousel>

                    <h3>{{ product.nombre }}</h3>
                    <p class="price">{{ product.precio.toFixed(2) }} €</p>
                    <button @click="addToCart(product)" class="add-to-cart">Añadir al carrito</button>
                </div>
            </div>
            <div v-else class="no-results">
                No hay productos disponibles.
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            recomendaciones: [],
            categorias: [],
            searchQuery: '',
            selectedCategory: null,
            loading: true,
            products: [], // Array principal de productos
            filteredProducts: [] // Array para almacenar los productos filtrados
        };
    },
    computed: {
        filteredProducts() {
            return this.products.filter(product => {
                const name = product?.nombre || '';
                const category = product?.categoria || '';

                const matchesName = name.toLowerCase().includes(this.searchQuery.toLowerCase());
                const matchesCategory = !this.selectedCategory || category === this.selectedCategory;

                return matchesName && matchesCategory;
            });
        },
    },
    methods: {
        async fncObtenerCategorias() {
            try {
                const token = sessionStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get(`http://localhost:8000/api/usuario/categorias`, config);
                this.categorias = response.data.categorias;
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        },

        async fncObtenerRecomendaciones() {
            try {
                const usuarioId = sessionStorage.getItem('id');
                const token = sessionStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get(`http://localhost:8000/api/usuario/productos/recomendaciones/${usuarioId}`, config);
                this.recomendaciones = response.data.productos.map(product => ({
                    ...product,
                    price: product.precio,
                }));
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        },

        async fncObtenerProductos() {
            try {
                const token = sessionStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get(`http://localhost:8000/api/usuario/productos`, config);
                this.products = response.data.productos.map(product => ({
                    ...product,
                    nombre: product.nombre || '',
                    categoria: product.categoria || '',
                    precio: product.precio || "N/A",
                }));
                // Filtrar los productos al obtenerlos
                this.filterProducts();
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        },

        async addToCart(product) {
            try {
                const idUsuario = sessionStorage.getItem('id');
                const token = sessionStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const ultimaCesta = await axios.get(`http://localhost:8000/api/usuario/obtener/estado/cesta/${idUsuario}`, config);
                const idCesta = ultimaCesta.data.data.id

                const payload = {
                    cesta_id: idCesta,
                    producto_id: product.id,
                    cantidad: 1,
                    precio_unitario: product.precio,
                    subtotal: product.precio
                };

                const response = await axios.post('http://localhost:8000/api/usuario/agregar/producto', payload, config);

                console.log('Producto agregado al carrito con éxito');
                alert(`Añadido al carrito: ${product.nombre}`);

            } catch (error) {
                console.error('Error al agregar al carrito:', error.response?.data || 'Error desconocido');
                alert('Ocurrió un error al agregar el producto al carrito. Por favor, inténtelo de nuevo.');
            }
        },

        filterProducts() {
            this.filteredProducts = this.products.filter(product => {
                const name = product.nombre.toLowerCase();
                const category = product.categoria.toLowerCase();

                const matchesName = name.includes(this.searchQuery.toLowerCase());
                const matchesCategory = !this.selectedCategory || category === this.selectedCategory;

                return matchesName && matchesCategory;
            });
        },
    },
    async created() {
        try {
            await Promise.all([
                this.fncObtenerCategorias(),
                this.fncObtenerRecomendaciones(),
                this.fncObtenerProductos(),
            ]);
            this.loading = false;
        } catch (error) {
            console.error('Error initializing component:', error);
        }
    },
};

</script>

<style scoped>
.store-container {
    padding: 20px;
}

.toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.search-input-container,
.select-container {
    flex: 1;
    padding-right: 10px;
}

.search-input-container {
    flex: 3;
}

.select-container {
    flex: 1;
}

.search-bar,
.select-bar {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
}

.product-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
}

.product-card:hover {
    transform: scale(1.05);
}

.producto-img {
    width: 100%;
    height: auto;
    object-fit: cover;
}

.price {
    font-size: 1.2em;
    font-weight: bold;
    color: #4caf50;
    margin: 10px 0;
}

.add-to-cart {
    padding: 8px 16px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.no-results {
    text-align: center;
    font-size: 16px;
    color: #757575;
}
</style>