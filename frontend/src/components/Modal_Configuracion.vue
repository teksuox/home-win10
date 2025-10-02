<template>
  <div class="modal fade" id="Modal_Configuracion" tabindex="-1" aria-labelledby="ModalConfiguracionLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="ModalConfiguracionLabel">Configuración</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <h6>Fondo de Pantalla</h6>
          <div class="form-check form-switch mb-3">
            <input 
              class="form-check-input" 
              type="checkbox" 
              role="switch" 
              id="imageBackgroundSwitch"
              v-model="localConfig.isImageBackgroundEnabled"
            >
            <label class="form-check-label" for="imageBackgroundSwitch">Activar fondo con imagen</label>
          </div>

          <div v-if="localConfig.isImageBackgroundEnabled">
            <label for="imageUpload" class="form-label">Subir nueva imagen de fondo</label>
            <input class="form-control" type="file" id="imageUpload" @change="handleFileChange" accept="image/*">
            <div class="form-text">La imagen se guardará en tu navegador para un acceso más rápido.</div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" class="btn btn-primary" @click="guardarCambios" data-bs-dismiss="modal">Guardar Cambios</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useDatosStore } from '@/stores/datos';

const datosStore = useDatosStore();

// Estado local para el formulario, inicializado desde el store
const localConfig = ref({ ...datosStore.configuracion });
const imageFile = ref(null);

// Mantener el estado local sincronizado si el store cambia
watch(() => datosStore.configuracion, (newConfig) => {
  localConfig.value = { ...newConfig };
}, { deep: true });

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;
  }
};

const guardarCambios = () => {
  datosStore.guardarConfiguracion(localConfig.value, imageFile.value);
  // Resetear el archivo para no volver a subirlo si no se cambia
  imageFile.value = null; 
};
</script>