<template>
  <div class="orders-page">
    <h1>Historial de Pedidos</h1>
    <v-container>
      <v-data-table
        :headers="headers"
        :items="orders"
        item-value="id"
        class="elevation-1"
        dense
        hide-default-footer
      >
        <!-- Cabecera de la tabla -->
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Historial de Pedidos</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
        </template>

        <!-- Plantilla para los items (no es necesario para este caso ya que solo mostramos total y fecha) -->
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      orders: [],
      headers: [
        { text: "Total (€)", value: "total" },
        { text: "Fecha de actualización", value: "updated_at" },
      ],
    };
  },
  methods: {
    async loadOrders() {
      try {
        const token = sessionStorage.getItem("token");
        const idUsuario = sessionStorage.getItem("id");

        // Llamada al API para obtener el historial
        const response = await axios.get(
          `http://localhost:8000/api/usuario/obtener/historial/${idUsuario}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Mostrar la respuesta completa en consola
        console.log("Respuesta del historial de pedidos:", response.data);

        // Mapear los datos para la tabla
        this.orders = [
          {
            total: response.data.data.total,
            updated_at: this.formatDate(response.data.data.updated_at),
          },
        ];
      } catch (error) {
        console.error("Error al cargar el historial de pedidos:", error);
        alert("No se pudo cargar el historial de pedidos. Intenta nuevamente.");
      }
    },
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
      return new Date(date).toLocaleDateString("es-ES", options);
    },
  },
  mounted() {
    this.loadOrders();
  },
};
</script>

<style scoped>
.orders-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.v-data-table {
  margin-top: 20px;
  width: 100%;
}

.v-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 10px;
}

.v-img {
  border-radius: 8px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.v-data-table thead {
  background-color: #f5f5f5;
}

.v-data-table th {
  font-weight: bold;
}
</style>
