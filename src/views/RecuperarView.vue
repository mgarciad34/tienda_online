<template>
    <div class="recuperar-container">
      <div class="recuperar-card">
        <h2>Recuperar Usuario</h2>
        <form @submit.prevent="handlerecuperar">
          <div class="form-group">
            <input type="email" id="email" v-model="email" required placeholder="Correo electrónico o teléfono">
          </div>
          <button type="submit">Recuperar Usuario</button>
          <div class="recuperar-options">
            <span><router-link to="/">Recuerdas tus claves ?, Inicia sesion</router-link></span>
            <span> <router-link to="/registro">Aun no tienes cuenta? Regístrate</router-link></span>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios';
  
  const email = ref('')
  
  const handlerecuperar = () => {
    const email = document.getElementById('email').value;
  
    axios.post('http://localhost:8000/api/recuperar', {
      email: email
    })
      .then(response => {
          window.location.href = "/"
      })
      .catch(error => {
        console.error('Error:', error.response);
      });
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
  
  .recuperar-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 9rem;
  }
  
  .recuperar-card {
    padding: 40px;
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
  
  input[type="email"] {
    width: 100%;
    height: 50px;
    padding: 0 15px;
    font-size: 16px;
    border: 1px solid #eaeaea;
    border-radius: 25px;
    outline: none;
    transition: all 0.3s ease;
  }
  
  input[type="email"]:focus {
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
  
  .recuperar-options {
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