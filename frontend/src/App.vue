<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted } from 'vue'

// Función para probar la conexión a MongoDB
const testMongoConnection = async () => {
  try {
    // Reemplaza esta URL con la de tu endpoint de backend
    const response = await fetch('http://localhost:3000/api/status')
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Conexión exitosa a MongoDB:', data)
      return true
    } else {
      console.error('❌ Error en la respuesta del servidor:', response.status)
      return false
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error.message)
    return false
  }
}

// Probar la conexión cuando la aplicación se monte
onMounted(() => {
  console.log('🔍 Probando conexión a MongoDB...')
  testMongoConnection()
})
</script>

<template>
  <RouterView />
</template>
