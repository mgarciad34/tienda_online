<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center" dense>
      <!-- Módulo Ver Categorías -->
      <v-col cols="12" sm="6" md="4" class="mb-4">
        <v-card
          class="pa-4 d-flex flex-column align-center justify-center"
          outlined
          elevation="4"
          hover
          :style="{ backgroundColor: '#FFB300', borderRadius: '16px' }"
        >
          <v-icon size="64" class="mb-3" color="black">mdi-view-list</v-icon>
          <h3 class="text-h6 font-weight-bold mb-2" style="color: black;">Ver Categorías</h3>
          <p class="text-body-2 text-center mb-4" style="color: black;">
            Administra y visualiza todas las categorías disponibles en tu tienda.
          </p>
          <v-btn
            to="/admin/dashboard/categorias"
            class="text-uppercase font-weight-bold"
            color="white"
            dark
            rounded
            :style="{ padding: '12px 24px' }"
            @mouseover="hoverButton = true"
            @mouseleave="hoverButton = false"
            :class="{ 'elevation-2': hoverButton }"
          >
            Ir a Categorías
          </v-btn>
        </v-card>
      </v-col>

      <!-- Módulo Ver Productos -->
      <v-col cols="12" sm="6" md="4">
        <v-card
          class="pa-4 d-flex flex-column align-center justify-center"
          outlined
          elevation="4"
          hover
          :style="{ backgroundColor: '#FFB300', borderRadius: '16px' }"
        >
          <v-icon size="64" class="mb-3" color="black">mdi-package-variant</v-icon>
          <h3 class="text-h6 font-weight-bold mb-2;" style="color: black;">Ver Productos</h3>
          <p class="text-body-2 text-center mb-4" style="color: black;">
            Gestiona y observa los productos disponibles en tu inventario.
          </p>
          <v-btn
            to="/admin/dashboard/productos"
            class="text-uppercase font-weight-bold"
            color="white"
            dark
            rounded
            :style="{ padding: '12px 24px' }"
            @mouseover="hoverButton = true"
            @mouseleave="hoverButton = false"
            :class="{ 'elevation-2': hoverButton }"
          >
            Ir a Productos
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ModulosDashboard",
  data() {
    return {
      hoverButton: false,
    };
  },
};
</script>
