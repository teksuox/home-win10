import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDatosModal = defineStore('datosmodal', () => {
  const datos = ref([])
  const paginaActual = ref(null)

  function agregarDato(dato) {
    datos.value.push(dato)
  }

  function limpiarDatos() {
    datos.value = []
  }

  function setPagina(pagina) {
    paginaActual.value = pagina
  }

  function limpiarPagina() {
    paginaActual.value = null
  }

  return {
    datos,
    paginaActual,
    agregarDato,
    limpiarDatos,
    setPagina,
    limpiarPagina
  }
})