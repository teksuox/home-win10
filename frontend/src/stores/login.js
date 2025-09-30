import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const user = ref(null)
  const token = ref(null)

  async function login(username, password) {
    try {
      const response = await fetch('http://backend:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      if (response.ok) {
        const data = await response.json()
        isAuthenticated.value = true
        user.value = data.user
        token.value = data.token
        
        // Guardar token en localStorage
        localStorage.setItem('authToken', data.token)
        localStorage.setItem('authUser', JSON.stringify(data.user))
        
        return true
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error en la autenticación')
      }
    } catch (error) {
      console.error('Error en login:', error)
      return false
    }
  }

  async function register(username, password) {
    try {
      const response = await fetch('http://backend:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      if (response.ok) {
        const data = await response.json()
        isAuthenticated.value = true
        user.value = data.user
        token.value = data.token
        
        // Guardar token en localStorage
        localStorage.setItem('authToken', data.token)
        localStorage.setItem('authUser', JSON.stringify(data.user))
        
        return true
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error en el registro')
      }
    } catch (error) {
      console.error('Error en registro:', error)
      return false
    }
  }

  function logout() {
    isAuthenticated.value = false
    user.value = null
    token.value = null
    
    // Eliminar datos del localStorage
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
  }

  // Verificar si hay una sesión activa al cargar la aplicación
  function checkAuthStatus() {
    const storedToken = localStorage.getItem('authToken')
    const storedUser = localStorage.getItem('authUser')
    
    if (storedToken && storedUser) {
      isAuthenticated.value = true
      user.value = JSON.parse(storedUser)
      token.value = storedToken
    }
  }

  return {
    isAuthenticated,
    user,
    token,
    login,
    register,
    logout,
    checkAuthStatus
  }
})