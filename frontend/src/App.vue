<template>
  <router-view />
</template>

<script setup>
import { onMounted, watchEffect } from 'vue';
import { useDatosStore } from '@/stores/datos';

const datosStore = useDatosStore();

onMounted(() => {
  // Cargar la configuración cuando la app se monta
  datosStore.cargarConfiguracion();
});

// Observar cambios en la configuración para aplicar estilos dinámicamente
watchEffect(() => {
  const config = datosStore.configuracion;
  const imageUrl = datosStore.backgroundImageUrl;

  if (config.isImageBackgroundEnabled && imageUrl) {
    document.body.style.setProperty('--bg-image', `url(${imageUrl})`);
    document.body.classList.add('background-image-active');
  } else {
    document.body.classList.remove('background-image-active');
  }
});
</script>
