<template>
    <v-app>      
      <EstructuraComponent />
      
<p>carrito</p>
    </v-app>    
  </template>
  
  <script>
  import EstructuraComponent from '@/components/usuario/EstructuraComponent.vue';
  
  export default {
    components: {
        EstructuraComponent
    },
    mounted() {
        if (!this.comprobarPermisos()) {
            this.$router.push({ name: 'home' });
            sessionStorage.clear();
        }
    },
    methods: {
        comprobarPermisos() {
            const rol = sessionStorage.getItem('rol');
            const token = sessionStorage.getItem('token');

            if (rol == 'Usuario' && token != "") {
                return true;
            } else {
                return false;
            }
        }
    }
};
  </script>
  
<style scoped>
</style>