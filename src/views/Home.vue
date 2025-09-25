<template>
  <div class="container-fluid d-flex flex-column">
    <Header />
    <Formulario />
    <div class="container-fluid d-flex flex-column mt-3">
      <div class="row">
        <div 
          v-for="categoria in datos" 
          :key="categoria.categoria"
          :class="columnaClase"
        >
          <h5 class="text-white">{{ categoria.categoria }}</h5>
          <draggable 
            v-model="categoria.paginas" 
            item-key="id"
            class="d-flex flex-wrap"
            @end="guardarOrden"
          >
            <template #item="{ element }">
              <div class="pagina-item" @click="abrirPagina(element.url)">
                <img :src="element.icono" :alt="element.nombre" width="32" height="32" />
                <span class="text-dark mt-2">{{ element.nombre }}</span>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
  </div>

  <ModalConfiguracion />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Header from '@/components/Header.vue'
import Formulario from '@/components/Modal_Formulario.vue'
import ModalConfiguracion from '@/components/Modal_Configuracion.vue'
import draggable from 'vuedraggable'

const datos = ref([])
const columnasSeleccionadas = ref(3)

// Calcular la clase de columna basada en la selección del usuario
const columnaClase = computed(() => {
  const clases = {
    2: 'col-md-6 col-lg-6 mb-4',
    3: 'col-md-4 col-lg-4 mb-4',
    4: 'col-md-3 col-lg-3 mb-4',
    6: 'col-md-2 col-lg-2 mb-4'
  }
  return clases[columnasSeleccionadas.value] || 'col-md-4 col-lg-4 mb-4'
})

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
    console.log('Datos cargados:', datos.value)
  } catch (error) {
    console.error('Error al cargar los datos:', error)
  }
}

// Guardar el orden de las páginas en localStorage
const guardarOrden = () => {
  localStorage.setItem('ordenPaginas', JSON.stringify(datos.value))
}

// Manejar el evento de configuración actualizada
const manejarConfiguracionActualizada = (event) => {
  columnasSeleccionadas.value = event.detail.columnas
}

// Función para abrir una página en la misma pestaña
const abrirPagina = (url) => {
  window.location.href = url
}

onMounted(() => {
  cargarDatos()
  
  // Cargar configuración inicial desde localStorage
  const configuracionGuardada = localStorage.getItem('configuracionColumnas')
  if (configuracionGuardada) {
    columnasSeleccionadas.value = parseInt(configuracionGuardada)
  }
  
  // Escuchar cambios de configuración
  window.addEventListener('configuracionActualizada', manejarConfiguracionActualizada)
})

// Limpiar el event listener cuando el componente se desmonte
// Nota: En Vue 3 con script setup, necesitamos usar onUnmounted si queremos limpiar
// import { onUnmounted } from 'vue'
// onUnmounted(() => {
//   window.removeEventListener('configuracionActualizada', manejarConfiguracionActualizada)
// })
</script>

<style scoped>
.pagina-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  padding: 10px;
  margin: 5px;
  background-color: #f8f9fa;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
}

.pagina-item img {
  margin-bottom: 5px;
}
</style>