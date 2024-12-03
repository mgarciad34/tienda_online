<template>
    <div class="store-container">
        <div class="toolbar">
            <input v-model="searchQuery" type="text" placeholder="Buscar productos" class="search-bar">
            <select v-model="selectedCategory" class="select-bar">
                <option value="" selected>Todas las categorías</option>
                <option v-for="categoria in categorias" :value="categoria.id" :key="categoria.id">
                    {{ categoria.nombre }}
                </option>
            </select>
        </div>

        <!-- Lista de recomendaciones -->
        <div class="recommendations">
            <h2>Recomendaciones para ti</h2>
            <div v-if="recomendaciones.length > 0" class="product-list">
                <div v-for="product in recomendaciones" :key="product.id" class="product-card">
                    <img :src="product?.image" alt="Imagen del producto" class="product-image" />
                    <h3>{{ product?.nombre }}</h3>
                    <h5>{{ product?.descripcion }}</h5>
                    <p class="price">{{ (product?.price && !isNaN(product.price)) ? product.price.toFixed(2) : 'N/A' }} €</p>
                    <button class="add-to-cart" @click="addToCart(product?.id)">
                        Añadir al carrito
                    </button>
                </div>
            </div>
            <div v-else class="no-results">
                No hay recomendaciones disponibles.
            </div>
        </div>

        <!-- Lista de productos -->
        <div class="products">
            <h2>Lista de productos</h2>
            <div v-if="filteredProducts.length > 0" class="product-list">
                <div v-for="product in filteredProducts" :key="product.id" class="product-card">
                    <img :src="product?.image" alt="Imagen del producto" class="product-image" />
                    <h3>{{ product?.nombre }}</h3>
                    <h5>{{ product?.descripcion }}</h5>
                    <p class="price">{{ (product?.price && !isNaN(product.price)) ? product.price.toFixed(2) : 'N/A' }} €</p>
                    <button class="add-to-cart" @click="addToCart(product?.id)">
                        Añadir al carrito
                    </button>
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
            products: [], // Initialize this array
        };
    },
    computed: {
        filteredProducts() {
            return this.products.filter(product => {
                const name = product?.name || '';
                const category = product?.category || '';

                const matchesName = name.toLowerCase().includes(this.searchQuery.toLowerCase());
                const matchesCategory = this.selectedCategory
                    ? category === this.selectedCategory
                    : true;

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
                    name: product.name || '',
                    category: product.category || '',
                    price: product.precio || "N/A",
                }));
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        },

        addToCart(product) {
            if (product && !isNaN(product.id)) {
                alert(`Añadido al carrito: ${product?.name}`);
            } else {
                console.warn('Invalid product ID:', product);
            }
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
    gap: 20px;
    margin-bottom: 20px;
}

.search-container {
    flex: 2;
    display: flex;
    flex-direction: column;
}

.search-label {
    font-size: 16px;
    margin-bottom: 8px;
    color: #424242;
}

.search-bar {
    padding: 10px 12px;
    font-size: 14px;
    border: 1px solid #bdbdbd;
    border-radius: 4px;
    outline: none;
    transition: border-color 0.2s ease;
}

.search-bar:focus {
    border-color: #3f51b5;
    box-shadow: 0 0 0 2px rgba(63, 81, 181, 0.2);
}

.select-container {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.select-label {
    font-size: 16px;
    margin-bottom: 8px;
    color: #424242;
}

.select-wrapper {
    position: relative;
}

select {
    width: 100%;
    padding: 10px 12px;
    font-size: 14px;
    border: 1px solid #bdbdbd;
    border-radius: 4px;
    outline: none;
    transition: border-color 0.2s ease;
}

select:focus {
    border-color: #3f51b5;
    box-shadow: 0 0 0 2px rgba(63, 81, 181, 0.2);
}

.loading-spinner {
    position: absolute;
    right: 10px;
    width: 16px;
    height: 16px;
    border: 2px solid #bdbdbd;
    border-top-color: #3f51b5;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.product-list {
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

.product-image {
    width: 100%;
    height: auto;
    border-radius: 8px;
    margin-bottom: 12px;
}

.price {
    font-size: 1.2em;
    font-weight: bold;
    color: #4caf50;
    margin: 10px 0;
}

.add-to-cart {
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.add-to-cart:hover {
    background-color: #45a049;
}

.no-results {
    text-align: center;
    font-size: 16px;
    color: #757575;
}
</style>