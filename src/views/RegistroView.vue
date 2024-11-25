<template>
    <div class="registro-container">
        <div class="registro-card">
            <h2>Registro de usuario</h2>
            <form @submit.prevent="handleRegistro()">
                <!-- Formulario contenido aquí -->
                <div class="form-group">
                    <input type="text" id="nombre" v-model="nombre" required placeholder="Nombre">
                </div>
                <div class="form-group">
                    <input type="email" id="email" v-model="email" required placeholder="Correo electrónico o teléfono">
                </div>
                <div class="form-group">
                    <input type="password" id="password" v-model="password" required placeholder="Contraseña">
                </div>
                <div class="form-group">
                    <input type="password" id="r-password" v-model="rPassword" required placeholder="Repetir contraseña">
                </div>
                <button type="submit">Registrar usuario</button>
                <div class="login-options">
                    <span>Ya tienes cuenta? <router-link to="/">Iniciar Sesion</router-link></span>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router';

const router = useRouter();
const nombre = ref('');
const email = ref('');
const password = ref('');
const rPassword = ref('');

const handleRegistro = async () => {
    try {
        if (password.value !== rPassword.value) {
            throw new Error('Las contraseñas no coinciden');
        }

        const data = {
            nombre: nombre.value,
            email: email.value,
            contrasena: password.value,
            rol: 'Usuario'
        };

        const response = await axios.post('http://localhost:8000/api/registro', data);

        if (response.status === 200) {
            router.push('/');
        } else {
            throw new Error('El registro falló. Verifica los datos ingresados.');
        }
    } catch (error) {
        console.error('Error:', error);
        
        if (error.response && error.response.status === 422) {
            const errorMessage = error.response.data?.message || 'Ocurrió un error de validación.';
            alert(errorMessage);
        } else {
            alert(error.message || 'Ocurrió un error al registrar.');
        }
    }
};
</script>

<style scoped>
body {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    min-height: 100vh;

}

.registro-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 9rem;
    width: 100%;
}

.registro-card {
    padding: 40px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(14, 30, 37, 0.12);
    width: 400px;
    max-width: 90%;
    height: 100%;
}

h2 {
    text-align: center;
    color: #333;
    margin-bottom: 35px;
    font-size: 24px;
    font-weight: bold;
}

.form-group {
    margin-bottom: 20px;
}

input[type="email"],
input[type="text"],
input[type="password"] {
    width: 100%;
    height: 50px;
    padding: 0 15px;
    font-size: 16px;
    border: 1px solid #eaeaea;
    border-radius: 25px;
    outline: none;
    transition: all 0.3s ease;
}

input[type="email"]:focus,
input[type="password"]:focus {
    border-color: #4CAF50;
    box-shadow: 0 0 0 0.2rem rgba(76, 175, 80, 0.25);
}

button {
    background-color: #4CAF50;
    color: white;
    padding: 12px 30px;
    border: none;
    border-radius: 25px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
    margin-top: 20px;
}

button:hover {
    background-color: #45a049;
}

.login-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
}

span {
    color: #4F5A69;
    font-size: 13px;
    cursor: pointer;
}

span:hover {
    color: #007BFF;
}
</style>
