<template>
  <div>
    <!-- Modal -->
    <div class="modal fade" id="ejemploModal" tabindex="-1" aria-labelledby="ejemploModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="ejemploModalLabel">Modal de Bootstrap</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Este es un ejemplo de modal utilizando Bootstrap 5.
            <p>ID recibido: {{ datosModal.idActual }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            <button type="button" class="btn btn-primary">Guardar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDatosModal } from '@/stores/datosmodal'
import { onMounted } from 'vue'

const datosModal = useDatosModal()

// Escuchar el evento personalizado para recibir el ID
onMounted(() => {
  window.addEventListener('enviarIdAModal', (event) => {
    const id = event.detail.id
    console.log('ID recibido en Modal_Prueba.vue:', id)
    // Guardar el ID en el store
    datosModal.setId(id)
  })
})
</script>