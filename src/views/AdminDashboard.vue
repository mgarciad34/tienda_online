<template>
    <v-app>      
      <CabezeraComponent />
      

    </v-app>
  </template>
  
  <script>
  import CabezeraComponent from '@/components/admin/EstructuraComponent.vue';
  
  export default {
    components: {
        CabezeraComponent
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

            if (rol == 'Administrador' && token != "") {
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