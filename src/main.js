import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Configuración corregida para solucionar el problema de aria-hidden
document.addEventListener('DOMContentLoaded', function () {
  if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
    // Sobrescribir la configuración predeterminada de los modales
    bootstrap.Modal.Default = {
      backdrop: true,
      keyboard: true,
      focus: true
    }
  }
})

app.mount('#app')
