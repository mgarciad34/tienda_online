<template>
  <div class="cart-page">
    <h1>Carrito de Compras</h1>
    <div v-if="cartItems.length > 0">
      <div v-for="(item, index) in cartItems" :key="item.id" class="cart-item">
        <div class="cart-item-details">
          <img :src="item.image" :alt="`Imagen del producto ${item.name}`" class="product-image" />
          <div>
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
            <p>
              Cantidad:
              <button @click="updateQuantity(index, item.quantity - 1, item)">-</button>
              <input 
                type="number" 
                v-model.number="item.quantity" 
                min="1"
                @change="validateQuantity(index)" />
              <button @click="updateQuantity(index, item.quantity + 1, item)">+</button>
            </p>
            <p>Precio: {{ item.price }} €</p>
            <p>Subtotal: {{ (item.quantity * item.price).toFixed(2) }} €</p>
          </div>
        </div>
        <button @click="removeItem(index)" class="delete-button">Eliminar</button>
      </div>

      <div class="cart-summary">
        <h3>Resumen de la compra</h3>
        <p>Total: {{ total }} €</p>
        <button @click="checkout">Finalizar Compra</button>
      </div>
    </div>

    <div v-else>
      <p>Tu carrito está vacío. Agrega productos para comenzar.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      cartItems: [],
    };
  },
  computed: {
    total() {
      return this.cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ).toFixed(2);
    },
  },
  methods: {
    async cargarDatos() {
      try {
        const token = sessionStorage.getItem("token");
        const id = sessionStorage.getItem("id");
        const response = await axios.get(
          `http://localhost:8000/api/usuario/carrito/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.cartItems = response.data.map((producto) => ({
          id: producto.id,
          name: producto.nombre,
          description: producto.descripcion,
          price: producto.subtotal / producto.cantidad,
          quantity: producto.cantidad,
          image: producto.img1,
          cestaId: producto.cesta_id,
          productoId: producto.producto_id,
        }));
      } catch (error) {
        console.error("Error al cargar los datos del carrito:", error);
        alert("No se pudo cargar el carrito. Intenta nuevamente.");
      }
    },
    validateQuantity(index) {
      const item = this.cartItems[index];
      if (item.quantity < 1) {
        alert("La cantidad mínima es 1.");
        item.quantity = 1;
      }
    },
    async updateQuantity(index, newQuantity, item) {
      if (newQuantity < 1) {
        alert("La cantidad mínima es 1.");
        return;
      }

      // Optimistic UI update
      const previousQuantity = item.quantity;
      const newSubtotal = (item.price * newQuantity).toFixed(2);
      this.cartItems[index].quantity = newQuantity;

      try {
        const token = sessionStorage.getItem("token");
        const datos = {
          cesta_id: item.cestaId,
          producto_id: item.productoId,
          cantidad: newQuantity,
          subtotal: newSubtotal,
          precio_unitario: item.price,
        };

        await axios.put(
          `http://localhost:8000/api/usuario/actualizar/producto/${item.id}`,
          datos,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(
          `Producto actualizado: ${item.name}, cantidad: ${newQuantity}, subtotal: ${newSubtotal} €`
        );
      } catch (error) {
        console.error("Error al actualizar el producto:", error);
        alert("Error al actualizar el producto. Intenta nuevamente.");
        this.cartItems[index].quantity = previousQuantity; // Revert optimistic update
      }
    },
    removeItem(index) {
      if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
        this.cartItems.splice(index, 1);
      }
    },
    checkout() {
      alert("Proceso de compra iniciado.");
    },
  },
  mounted() {
    this.cargarDatos();
  },
};
</script>

<style scoped>
.cart-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
}

.cart-item-details {
  display: flex;
}

.product-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 20px;
}

.cart-summary {
  margin-top: 20px;
  text-align: right;
}

button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
}

button:hover {
  background-color: #45a049;
}

.delete-button {
  background-color: #f44336;
}

.delete-button:hover {
  background-color: #d32f2f;
}

input[type="number"] {
  width: 50px;
  padding: 5px;
  font-size: 16px;
  margin-left: 10px;
  text-align: center;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

p {
  font-size: 16px;
}

@media (max-width: 600px) {
  .cart-page {
    padding: 10px;
  }
  .cart-item {
    flex-direction: column;
    align-items: center;
  }
  .product-image {
    margin-bottom: 10px;
  }
}
</style>
