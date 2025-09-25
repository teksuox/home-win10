import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDatosStore = defineStore('datos', () => {
  const datos = ref([])
  const columnasSeleccionadas = ref(3)
  
  // Cargar datos desde el archivo JSON
  const cargarDatos = async () => {
    try {
      // Verificar si hay datos guardados en localStorage
      const datosGuardados = localStorage.getItem('ordenPaginas')
      if (datosGuardados) {
        datos.value = JSON.parse(datosGuardados)
      } else {
        // Si no hay datos guardados, cargar desde el archivo JSON
        const response = await fetch('/datos.json')
        const data = await response.json()
        datos.value = data
      }
    } catch (error) {
      console.error('Error al cargar los datos:', error)
    }
  }
  
  // Guardar el orden de las páginas en localStorage
  const guardarOrden = () => {
    localStorage.setItem('ordenPaginas', JSON.stringify(datos.value))
  }
  
  // Guardar configuración de columnas
  const guardarConfiguracionColumnas = (columnas) => {
    columnasSeleccionadas.value = columnas
    localStorage.setItem('configuracionColumnas', columnas)
  }
  
  // Cargar configuración de columnas
  const cargarConfiguracionColumnas = () => {
    const configuracionGuardada = localStorage.getItem('configuracionColumnas')
    if (configuracionGuardada) {
      columnasSeleccionadas.value = parseInt(configuracionGuardada)
    }
    return columnasSeleccionadas.value
  }
  
  // Agregar una nueva página
  const agregarPagina = (nuevaPagina) => {
    const categoria = datos.value.find(cat => cat.categoria === nuevaPagina.categoria)
    if (categoria) {
      // Generar un ID único para la nueva página
      const nuevoId = Date.now() // Usar timestamp como ID único
      categoria.paginas.push({
        id: nuevoId,
        nombre: nuevaPagina.nombre,
        url: nuevaPagina.url,
        icono: `https://www.google.com/s2/favicons?domain=${new URL(nuevaPagina.url).hostname}`
      })
      guardarOrden()
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