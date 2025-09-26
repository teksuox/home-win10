<template>
  <div class="row">
    <div class="col-auto text-white p-2 d-flex align-items-center gap-2">
      <div class="d-flex align-items-center">
        <i class="bi bi-sun"></i>
        <div class="ms-2">
          <div class="fw-bold">25°C</div>
          <div>Soleado</div>
          <div class="small">Ciudad de México</div>
        </div>
      </div>
    </div>
    <div class="col text-center d-flex align-items-center justify-content-center">
      <form class="w-100">
        <div class="input-group search-input">
          <input type="text" class="form-control form-control-sm" placeholder="Buscar..." style="outline: none; box-shadow: none;">
          <button class="btn btn-secondary btn-outline-secondary" type="submit">
            <i class="bi bi-search text-white"></i>
          </button>
        </div>
      </form>
    </div>
    <div class="col-auto  p-2 d-flex align-items-center gap-2">
      <button class="btn btn-primary rounded-circle square-btn" data-bs-toggle="modal" data-bs-target="#Modal_Configuracion">
        <i class="bi bi-gear"></i>
      </button>
      <button class="btn btn-light rounded-circle square-btn" data-bs-toggle="modal" data-bs-target="#Modal_Formulario">
        <i class="bi bi-plus-lg"></i>
      </button>
      <button class="btn btn-warning rounded-circle square-btn" @click="toggleDarkMode">
        <i class="bi" :class="darkMode ? 'bi-sun' : 'bi-moon'"></i>
      </button>
      <button class="btn btn-danger rounded-circle square-btn">
        <i class="bi bi-box-arrow-right"></i>
      </button>
    </div>
  </div>
  <ModalConfiguracion />
  <ModalFormulario />
  <ModalPrueba />
</template>

<script setup>
import { ref, onMounted, watch, provide } from 'vue'
import ModalConfiguracion from '@/components/Modal_Configuracion.vue'
import ModalFormulario from '@/components/Modal_Formulario.vue'
import ModalPrueba from '@/components/Modal_Prueba.vue'

const darkMode = ref(false)

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
}

// Proporcionar la función toggleDarkMode y el estado darkMode a los componentes hijos
provide('darkMode', darkMode)
provide('toggleDarkMode', toggleDarkMode)

// Aplicar el modo oscuro al cuerpo del documento
watch(darkMode, (newVal) => {
  if (newVal) {
    document.body.classList.add('dark-mode')
  } else {
    document.body.classList.remove('dark-mode')
  }
})

// Verificar si el modo oscuro estaba activo en una sesión anterior
onMounted(() => {
  const isDarkMode = localStorage.getItem('darkMode') === 'true'
  darkMode.value = isDarkMode
  if (isDarkMode) {
    document.body.classList.add('dark-mode')
  }
})

// Guardar la preferencia del usuario
watch(darkMode, (newVal) => {
  localStorage.setItem('darkMode', newVal.toString())
})

</script>