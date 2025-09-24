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
      <div class="input-group search-input">
        <input type="text" class="form-control form-control-sm" placeholder="Buscar...">
        <button class="btn btn-outline-secondary" type="button">
          <i class="bi bi-search"></i>
        </button>
      </div>
    </div>
    <div class="col-auto  p-2 d-flex align-items-center gap-2">
      <button class="btn btn-primary square-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">
        <i class="bi bi-gear"></i>
      </button>
      <button class="btn btn-warning square-btn" @click="toggleDarkMode">
        <i class="bi" :class="darkMode ? 'bi-sun' : 'bi-moon'"></i>
      </button>
      <button class="btn btn-danger square-btn">
        <i class="bi bi-box-arrow-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, provide } from 'vue'

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