import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './login'

export const useDatosStore = defineStore('datos', () => {
  const datos = ref([])
  const columnasSeleccionadas = ref(3)
  const authStore = useAuthStore()
  
  // Función para obtener headers con token de autenticación
  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authStore.token}`
    }
  }
  
  // Guardar datos en localStorage
  const guardarEnLocalStorage = (data) => {
    try {
      localStorage.setItem('datosHome', JSON.stringify(data))
    } catch (error) {
      console.error('Error al guardar en localStorage:', error)
    }
  }
  
  // Cargar datos desde localStorage
  const cargarDesdeLocalStorage = () => {
    try {
      const data = localStorage.getItem('datosHome')
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error al cargar desde localStorage:', error)
      return []
    }
  }
  
  // Cargar datos desde el backend
  const cargarDatos = async () => {
    try {
      // Primero cargar desde localStorage si existen datos
      const localData = cargarDesdeLocalStorage()
      if (localData.length > 0) {
        datos.value = localData
      }
      
      // Verificar si el usuario está autenticado antes de cargar desde backend
      if (!authStore.isAuthenticated) {
        console.warn('Usuario no autenticado, usando datos locales')
        return
      }
      
      // Luego intentar cargar desde el backend
      const response = await fetch('http://localhost:3000/api/datos', {
        headers: getAuthHeaders()
      })
      
      if (response.ok) {
        const data = await response.json()
        datos.value = data
        // Guardar en localStorage después de obtener datos del backend
        guardarEnLocalStorage(data)
      } else if (response.status === 401) {
        // Token inválido, cerrar sesión
        authStore.logout()
        throw new Error('Sesión expirada')
      }
    } catch (error) {
      console.error('Error al cargar los datos:', error)
      // Fallback a datos locales si hay error de conexión
      try {
        const localData = cargarDesdeLocalStorage()
        if (localData.length > 0) {
          datos.value = localData
        }
      } catch (localError) {
        console.error('Error al cargar datos locales:', localError)
      }
    }
  }
  
  // Guardar el orden de las páginas en el backend
  const guardarOrden = async () => {
    try {
      if (!authStore.isAuthenticated) {
        throw new Error('Usuario no autenticado')
      }
      
      const response = await fetch('http://localhost:3000/api/datos/orden', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ datos: datos.value })
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          authStore.logout()
          throw new Error('Sesión expirada')
        }
        throw new Error('Error al guardar el orden')
      }
      
      const result = await response.json()
      console.log('Orden guardado:', result.message)
      // Guardar en localStorage después de guardar en backend
      guardarEnLocalStorage(datos.value)
    } catch (error) {
      console.error('Error al guardar el orden:', error)
      // Guardar en localStorage incluso si falla el backend
      guardarEnLocalStorage(datos.value)
      throw error
    }
  }
  
  // Guardar configuración de columnas
  const guardarConfiguracionColumnas = async (columnas) => {
    try {
      if (!authStore.isAuthenticated) {
        throw new Error('Usuario no autenticado')
      }
      
      columnasSeleccionadas.value = columnas
      const response = await fetch('http://localhost:3000/api/configuracion/columnas', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ columnas })
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          authStore.logout()
          throw new Error('Sesión expirada')
        }
        throw new Error('Error al guardar configuración')
      }
      
      const result = await response.json()
      console.log('Configuración guardada:', result.message)
    } catch (error) {
      console.error('Error al guardar configuración:', error)
      throw error
    }
  }
  
  // Cargar configuración de columnas
  const cargarConfiguracionColumnas = async () => {
    try {
      if (!authStore.isAuthenticated) {
        return columnasSeleccionadas.value
      }
      
      const response = await fetch('http://localhost:3000/api/configuracion/columnas', {
        headers: getAuthHeaders()
      })
      
      if (response.ok) {
        const data = await response.json()
        columnasSeleccionadas.value = data.columnas
      }
      return columnasSeleccionadas.value
    } catch (error) {
      console.error('Error al cargar configuración:', error)
      return columnasSeleccionadas.value
    }
  }
  
  // Agregar una nueva página
  const agregarPagina = async (nuevaPagina) => {
    try {
      if (!authStore.isAuthenticated) {
        throw new Error('Usuario no autenticado')
      }
      
      const response = await fetch('http://localhost:3000/api/datos/pagina', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          categoria: nuevaPagina.categoria,
          pagina: {
            id: Date.now(),
            nombre: nuevaPagina.nombre,
            url: nuevaPagina.url,
            icono: `https://www.google.com/s2/favicons?domain=${new URL(nuevaPagina.url).hostname}&sz=64`,
            categoria: nuevaPagina.categoria
          }
        })
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          authStore.logout()
          throw new Error('Sesión expirada')
        }
        throw new Error('Error al agregar página')
      }
      
      const result = await response.json()
      console.log('Página agregada:', result.message)
      
      // Recargar los datos para reflejar los cambios
      await cargarDatos()
    } catch (error) {
      console.error('Error al agregar página:', error)
      // Guardar datos actuales en localStorage incluso si falla el backend
      guardarEnLocalStorage(datos.value)
      throw error
    }
  }
  
  // Actualizar una página existente
  const actualizarPagina = async (paginaActualizada) => {
    try {
      if (!authStore.isAuthenticated) {
        throw new Error('Usuario no autenticado')
      }
      
      const response = await fetch('http://localhost:3000/api/datos/editarpagina', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          id: paginaActualizada.id,
          pagina: paginaActualizada
        })
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          authStore.logout()
          throw new Error('Sesión expirada')
        }
        throw new Error('Error al actualizar página')
      }
      
      const result = await response.json()
      console.log('Página actualizada:', result.message)
      
      // Recargar los datos para reflejar los cambios
      await cargarDatos()
    } catch (error) {
      console.error('Error al actualizar página:', error)
      // Guardar datos actuales en localStorage incluso si falla el backend
      guardarEnLocalStorage(datos.value)
      throw error
    }
  }
  
  // Obtener lista de categorías
  const categorias = computed(() => {
    return datos.value.map(item => ({
      categoria: item.categoria
    }))
  })
  
  // Clase de columna basada en la selección del usuario
  const columnaClase = computed(() => {
    const clases = {
      2: 'col-md-6 col-lg-6 mb-4',
      3: 'col-md-4 col-lg-4 mb-4',
      4: 'col-md-3 col-lg-3 mb-4',
      6: 'col-md-2 col-lg-2 mb-4'
    }
    return clases[columnasSeleccionadas.value] || 'col-md-4 col-lg-4 mb-4'
  })
  
  return {
    datos,
    columnasSeleccionadas,
    categorias,
    columnaClase,
    cargarDatos,
    guardarOrden,
    guardarConfiguracionColumnas,
    cargarConfiguracionColumnas,
    agregarPagina,
    actualizarPagina
  }
})