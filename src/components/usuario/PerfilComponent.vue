<template>
    <v-container>
        <!-- Card para mostrar el perfil del usuario -->
        <v-card class="mx-auto" max-width="400">
            <v-card-title>
                Perfil del Usuario
            </v-card-title>
            <v-card-text>
                <v-list dense>
                    <v-list-item>
                        <v-list-item-title>Nombre:</v-list-item-title>
                        <v-list-item-subtitle>{{ formData.nombre }}</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title>Correo:</v-list-item-title>
                        <v-list-item-subtitle>{{ formData.correo }}</v-list-item-subtitle>
                    </v-list-item>
                </v-list>
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" @click="abrirModal">Actualizar Usuario</v-btn>
            </v-card-actions>
        </v-card>

        <!-- Modal para actualizar usuario -->
        <v-dialog v-model="modalVisible" max-width="500">
            <v-card>
                <v-card-title>Actualizar Usuario</v-card-title>
                <v-card-text>
                    <v-text-field v-model="formData.nombre" label="Nombre" required>
                    </v-text-field>
                    <v-text-field v-model="formData.correo" label="Correo" required>
                    </v-text-field>
                    <v-text-field v-model="formData.contrasena" :type="mostrarContrasena ? 'text' : 'password'"
                        label="Contraseña" :append-inner-icon="mostrarContrasena ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append-inner="mostrarContrasena = !mostrarContrasena">
                    </v-text-field>
                    <v-text-field v-model="repetirContrasena" :type="mostrarRContrasena ? 'text' : 'password'"
                        label="Repetir Contraseña" :append-inner-icon="mostrarRContrasena ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append-inner="mostrarRContrasena = !mostrarRContrasena">
                    </v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cerrarModal">Cancelar</v-btn>
                    <v-btn color="blue darken-1" text @click="actualizarUsuario">Guardar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="snackbar.visible" :timeout="snackbar.timeout" color="red">
            {{ snackbar.message }}
        </v-snackbar>
    </v-container>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            usuario: {
                id: "",
                nombre: "",
                correo: "",
            },
            modalVisible: false,
            formData: {
                id: "",
                nombre: "",
                correo: "",
                contrasena: "",
            },
            repetirContrasena: "",
            mostrarContrasena: false,
            mostrarRContrasena: false,
            snackbar: {
                visible: false,
                message: "",
                timeout: 5000,
            },
        };
    },
    methods: {
        async cargarUsuario() {
            const token = sessionStorage.getItem("token");
            const id = sessionStorage.getItem("id");
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/usuario/obtener/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const usuario = response.data.usuario[0];
                this.usuario = usuario;
                this.formData.id = usuario.id;
                this.formData.nombre = usuario.nombre;
                this.formData.correo = usuario.email;
            } catch (error) {
                console.error("Error al cargar el usuario:", error);
            }
        },
        abrirModal() {
            this.modalVisible = true;
        },
        cerrarModal() {
            this.modalVisible = false;
            this.formData.contrasena = "";
            this.repetirContrasena = "";
        },
        async actualizarUsuario() {
            try {

                // Crear el objeto de datos del usuario
                const userData = {
                    nombre: this.formData.nombre,
                    email: this.formData.correo,
                };

                // Validación de contraseñas
                if (this.formData.contrasena || this.repetirContrasena) {
                    if (this.formData.contrasena !== this.repetirContrasena) {
                        console.error("Las contraseñas no coinciden");
                        alert("Las contraseñas no coinciden");
                        return;
                    } else {
                        userData.contrasena = this.formData.contrasena;
                    }
                }

                console.log(this.formData)
                // Configuración de headers
                const config = {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                };

                // Hacer la petición PUT
                const response = await axios.put(
                    `http://localhost:8000/api/usuario/actualizar/${this.formData.id}`,
                    userData,
                    config
                );

                console.log("Usuario actualizado con éxito:", response.data);
                alert("Usuario actualizado con éxito");
            } catch (error) {
                console.error("Error al actualizar el usuario:", error.message);
                alert("Error al actualizar el usuario: " + error.message);
            } finally {
                this.cerrarModal();
            }
        },
    },
    mounted() {
        this.cargarUsuario();
    },
};
</script>

<style scoped>
.v-card {
    margin-top: 20px;
}
</style>
