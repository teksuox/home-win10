<template>
  <div class="container-fluid d-flex flex-column">
    <Header />
    
    <div class="container-fluid d-flex flex-column mt-3">
      <div class="row">
        <div class="col">
          1 of 3
        </div>
        <div class="col">
          2 of 3
        </div>
        <div class="col">
          3 of 3
        </div>
      </div>
    </div>
  </div>

  <ModalConfiguracion />
</template>

<script setup>

import Header from '@/components/Header.vue'
import ModalConfiguracion from '@/components/Modal_Configuracion.vue'


</script>