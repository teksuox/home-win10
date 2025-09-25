<template>
  <div class="modal fade" id="Modal_Configuracion" tabindex="-1" aria-labelledby="ModalConfiguracionLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="ModalConfiguracionLabel">Configuración</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="columnas" class="form-label">Número de columnas</label>
            <select id="columnas" class="form-select" v-model="columnasSeleccionadas">
              <option value="2">2 columnas</option>
              <option value="3">3 columnas</option>
              <option value="4">4 columnas</option>
              <option value="6">6 columnas</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" class="btn btn-primary" @click="guardarConfiguracion" data-bs-dismiss="modal">Guardar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Definir las columnas disponibles
const columnas = ref([
  { valor: 2, clase: 'col-md-6' },
  { valor: 3, clase: 'col-md-4' },
  { valor: 4, clase: 'col-md-3' },
  { valor: 6, clase: 'col-md-2' }
])

// Valor seleccionado por defecto
const columnasSeleccionadas = ref(3)

// Cargar configuración inicial desde localStorage cuando se monta el componente
onMounted(() => {
  const configuracionGuardada = localStorage.getItem('configuracionColumnas')
  if (configuracionGuardada) {
    columnasSeleccionadas.value = parseInt(configuracionGuardada)
  } else {
    // Si no hay configuración guardada, establecer el valor por defecto en localStorage
    localStorage.setItem('configuracionColumnas', 3)
  }
})

// Función para guardar la configuración
const guardarConfiguracion = () => {
  // Guardar en localStorage
  localStorage.setItem('configuracionColumnas', columnasSeleccionadas.value)
  
  // Emitir un evento para notificar a otros componentes del cambio
  window.dispatchEvent(new CustomEvent('configuracionActualizada', {
    detail: { columnas: columnasSeleccionadas.value }
  }))
}
</script>