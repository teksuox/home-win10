<template>
  <div class="modal fade" id="Modal_Formulario" tabindex="-1" aria-labelledby="ModalFormularioLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="ModalFormularioLabel">{{ datosModal.modoEdicionFormulario ? 'Editar página' : 'Agregar nueva página' }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="limpiarFormulario"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="guardarPagina">
            <div class="mb-3">
              <label for="nombre" class="form-label">Nombre de la página</label>
              <input 
                type="text" 
                class="form-control" 
                id="nombre" 
                v-model="formulario.nombre"
                placeholder="Ingrese el nombre de la página"
                required
              >
            </div>
            
            <div class="mb-3">
              <label for="url" class="form-label">URL de la página</label>
              <input 
                type="url" 
                class="form-control" 
                id="url" 
                v-model="formulario.url"
                placeholder="https://example.com"
                required
              >
            </div>
            
            <div class="mb-3" v-show="!crearNuevaCategoria">
              <label for="categoria" class="form-label">Categoría</label>
              <select 
                class="form-select" 
                id="categoria" 
                v-model="formulario.categoria" 
                required
              >
                <option value="">Seleccione una categoría</option>
                <option 
                  v-for="categoria in datosStore.categorias" 
                  :key="categoria.categoria" 
                  :value="categoria.categoria"
                  :selected="formulario.categoria === categoria.categoria"
                >
                  {{ categoria.categoria }}
                </option>
              </select>
            </div>
                        
            <div class="mb-3" v-if="crearNuevaCategoria && !datosModal.modoEdicionFormulario">
              <label for="nuevaCategoria" class="form-label">Nueva categoría</label>
              <input 
                type="text" 
                class="form-control" 
                id="nuevaCategoria" 
                v-model="nuevaCategoriaNombre"
                placeholder="Nombre de la nueva categoría"
                required
              >
            </div>
            
            <div class="mb-3 form-check" v-if="!datosModal.modoEdicionFormulario">
              <input 
                type="checkbox" 
                class="form-check-input" 
                id="nuevaCategoriaCheck"
                v-model="crearNuevaCategoria"
              >
              <label class="form-check-label" for="nuevaCategoriaCheck">
                Crear nueva categoría
              </label>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="limpiarFormulario">Cerrar</button>
          <button type="button" class="btn btn-primary" @click="guardarPagina" data-bs-dismiss="modal">{{ datosModal.modoEdicionFormulario ? 'Actualizar' : 'Guardar' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref,watch } from 'vue'
  import { useDatosStore } from '@/stores/datos'
  import { useDatosModal } from '@/stores/datosmodal'

  const datosStore = useDatosStore()
  const datosModal = useDatosModal()

  const formulario = ref({
    nombre: '',
    url: '',
    categoria: ''
  })

  const crearNuevaCategoria = ref(false)
  const nuevaCategoriaNombre = ref('')

  const limpiarFormulario = () => {
    formulario.value.nombre = ''
    formulario.value.url = ''
    formulario.value.categoria = ''
    crearNuevaCategoria.value = false
    nuevaCategoriaNombre.value = ''
    datosModal.datos = []
    datosModal.paginaActual = null
    datosModal.modoEdicionFormulario = false
  }

  const guardarPagina = () => {
    // Verificar si estamos editando una página existente
    const paginaParaEditar = datosModal.paginaActual || (datosModal.datos.length > 0 ? datosModal.datos[0] : null)
    
    if (paginaParaEditar) {
      // Actualizar página existente
      const paginaActualizada = {
        ...paginaParaEditar,
        id: paginaParaEditar.id, // Mantener el mismo ID
        nombre: formulario.value.nombre,
        url: formulario.value.url,
        icono: `https://www.google.com/s2/favicons?domain=${new URL(formulario.value.url).hostname}&sz=64`,
        categoria: formulario.value.categoria 
      }
      
      datosStore.actualizarPagina(paginaActualizada)
    } else {
      // Agregar nueva página
      let categoriaFinal = formulario.value.categoria
      
      if (crearNuevaCategoria.value && nuevaCategoriaNombre.value.trim()) {
        categoriaFinal = nuevaCategoriaNombre.value.trim()
      }
      
      const paginaParaGuardar = {
        ...formulario.value,
        categoria: categoriaFinal
      }
      
      datosStore.agregarPagina(paginaParaGuardar)
    }
    
    // Limpiar el formulario después de guardar
    limpiarFormulario()
  }


  // Observar cambios en datosModal.modoEdicionFormulario usando el objeto reactivo
  watch(
    () => datosModal.modoEdicionFormulario,
    (nuevoValor) => {      
      if (!nuevoValor) {
        limpiarFormulario()
      }

      if (nuevoValor){
        if (datosModal.paginaActual) {
          formulario.value.nombre = datosModal.paginaActual.nombre || ''
          formulario.value.url = datosModal.paginaActual.url || ''
          formulario.value.categoria = datosModal.paginaActual.categoria || ''
        } else if (datosModal.datos.length > 0) {
          const pagina = datosModal.datos[0]
          formulario.value.nombre = pagina.nombre || ''
          formulario.value.url = pagina.url || ''
          formulario.value.categoria = pagina.categoria || ''
        }
      }
    },
    { immediate: true }
  )

</script>