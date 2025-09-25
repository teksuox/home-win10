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
            <select id="columnas" class="form-select" v-model="datosStore.columnasSeleccionadas" @change="guardarConfiguracion">
              <option value="2">2 columnas</option>
              <option value="3">3 columnas</option>
              <option value="4">4 columnas</option>
              <option value="6">6 columnas</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useDatosStore } from '@/stores/datos'

const datosStore = useDatosStore()

// Cargar configuración inicial desde localStorage cuando se monta el componente
onMounted(() => {
  datosStore.cargarConfiguracionColumnas()
})

// Función para guardar la configuración
const guardarConfiguracion = () => {
  // Guardar en localStorage usando el store
  datosStore.guardarConfiguracionColumnas(datosStore.columnasSeleccionadas)
  
  // Emitir un evento para notificar a otros componentes del cambio
  window.dispatchEvent(new CustomEvent('configuracionActualizada', {
    detail: { columnas: datosStore.columnasSeleccionadas }
  }))
}
</script>