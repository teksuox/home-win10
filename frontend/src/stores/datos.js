import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDatosStore = defineStore('datos', () => {
  const datos = ref([])
  const columnasSeleccionadas = ref(3)
  
  // Cargar datos desde el backend
  const cargarDatos = async () => {
    try {
      // Primero intentar cargar desde el backend
      const response = await fetch('http://localhost:3000/api/datos')
      if (response.ok) {
        const data = await response.json()
        datos.value = data
      } else {
        // Si no hay datos en el backend, cargar desde el archivo JSON local
        const localResponse = await fetch('/datos.json')
        const localData = await localResponse.json()
        datos.value = localData
        
        // Guardar los datos locales en el backend para futuras sesiones
        await guardarOrden()
      }
    } catch (error) {
      console.error('Error al cargar los datos:', error)
      // Fallback a datos locales si hay error de conexión
      try {
        const localResponse = await fetch('/datos.json')
        const localData = await localResponse.json()
        datos.value = localData
      } catch (localError) {
        console.error('Error al cargar datos locales:', localError)
      }
    }
  }
  
  // Guardar el orden de las páginas en el backend
  const guardarOrden = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/datos/orden', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ datos: datos.value })
      })
      
      if (!response.ok) {
        throw new Error('Error al guardar el orden')
      }
      
      const result = await response.json()
      console.log('Orden guardado:', result.message)
    } catch (error) {
      console.error('Error al guardar el orden:', error)
    }
  }
  
  // Guardar configuración de columnas
  const guardarConfiguracionColumnas = async (columnas) => {
    try {
      columnasSeleccionadas.value = columnas
      const response = await fetch('http://localhost:3000/api/configuracion/columnas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ columnas })
      })
      
      if (!response.ok) {
        throw new Error('Error al guardar configuración')
      }
      
      const result = await response.json()
      console.log('Configuración guardada:', result.message)
    } catch (error) {
      console.error('Error al guardar configuración:', error)
    }
  }
  
  // Cargar configuración de columnas
  const cargarConfiguracionColumnas = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/configuracion/columnas')
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
      const response = await fetch('http://localhost:3000/api/datos/pagina', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          categoria: nuevaPagina.categoria,
          pagina: {
            id: Date.now(),
            nombre: nuevaPagina.nombre,
            url: nuevaPagina.url,
            icono: `https://www.google.com/s2/favicons?domain=${new URL(nuevaPagina.url).hostname}`,
            categoria: nuevaPagina.categoria
          }
        })
      })
      
      if (!response.ok) {
        throw new Error('Error al agregar página')
      }
      
      const result = await response.json()
      console.log('Página agregada:', result.message)
      
      // Recargar los datos para reflejar los cambios
      await cargarDatos()
    } catch (error) {
      console.error('Error al agregar página:', error)
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
    agregarPagina
  }
})