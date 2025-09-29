<template>
  <div class="login-container">
    <form @submit.prevent="isRegistering ? handleRegister() : handleLogin()" class="login-form">
      <h2>{{ isRegistering ? 'Registrarse' : 'Iniciar Sesión' }}</h2>
      <div class="form-group">
        <label for="username">Usuario:</label>
        <input 
          type="text" 
          id="username" 
          v-model="username" 
          required 
          class="form-control"
          :disabled="loading"
        />
      </div>
      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          required 
          class="form-control"
          :disabled="loading"
        />
      </div>
      <div v-if="isRegistering" class="form-group">
        <label for="confirmPassword">Confirmar Contraseña:</label>
        <input 
          type="password" 
          id="confirmPassword" 
          v-model="confirmPassword" 
          required 
          class="form-control"
          :disabled="loading"
        />
      </div>
      <button type="submit" class="btn-login" :disabled="loading">
        {{ loading ? (isRegistering ? 'Registrando...' : 'Ingresando...') : (isRegistering ? 'Registrarse' : 'Ingresar') }}
      </button>
      <p v-if="error" class="error-message">{{ error }}</p>
      <p class="toggle-form">
        {{ isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?' }}
        <a href="#" @click.prevent="toggleForm">
          {{ isRegistering ? 'Inicia sesión' : 'Regístrate' }}
        </a>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/login'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)
const isRegistering = ref(false)

// Verificar si ya está autenticado al cargar el componente
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})

const toggleForm = () => {
  isRegistering.value = !isRegistering.value
  error.value = ''
}

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  
  try {
    const success = await authStore.login(username.value, password.value)
    
    if (success) {
      router.push('/')
    } else {
      error.value = 'Credenciales inválidas'
    }
  } catch (err) {
    error.value = 'Error al iniciar sesión. Por favor, inténtalo de nuevo.'
    console.error('Error en login:', err)
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  error.value = ''
  
  // Validar que las contraseñas coincidan
  if (password.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden'
    return
  }
  
  loading.value = true
  
  try {
    const success = await authStore.register(username.value, password.value)
    
    if (success) {
      router.push('/')
    } else {
      error.value = 'Error al registrar usuario'
    }
  } catch (err) {
    error.value = 'Error al registrar usuario. Por favor, inténtalo de nuevo.'
    console.error('Error en registro:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-control:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.btn-login {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-login:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-login:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 1rem;
}

.toggle-form {
  text-align: center;
  margin-top: 1rem;
}

.toggle-form a {
  color: #007bff;
  text-decoration: none;
}

.toggle-form a:hover {
  text-decoration: underline;
}
</style>