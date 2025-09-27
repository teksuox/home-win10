import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDatosModal = defineStore('datosmodal', () => {
  const datos = ref([])
  const paginaActual = ref(null)
  const modoEdicionFormulario = ref(false)

  function agregarDato(dato) {
    datos.value.push(dato)
  }

  function setPagina(pagina) {
    paginaActual.value = pagina
  }

  function EditarDatosFormulario(valor) {
    modoEdicionFormulario.value = valor
  }

  return {
    datos,
    paginaActual,
    modoEdicionFormulario,
    agregarDato,
    setPagina,
    EditarDatosFormulario
  }
})