<template>
  <div class="modal fade" id="Modal_Formulario" tabindex="-1" aria-labelledby="ModalFormularioLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="ModalFormularioLabel">Agregar nueva página</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                >
                  {{ categoria.categoria }}
                </option>
              </select>
            </div>
                        
            <div class="mb-3" v-if="crearNuevaCategoria">
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
            
            <div class="mb-3 form-check">
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
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" class="btn btn-primary" @click="guardarPagina" data-bs-dismiss="modal">Guardar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDatosStore } from '@/stores/datos'

const datosStore = useDatosStore()

const formulario = ref({
  nombre: '',
  url: '',
  categoria: ''
})

const crearNuevaCategoria = ref(false)
const nuevaCategoriaNombre = ref('')

const categoriasDisponibles = computed(() => {
  return datosStore.categorias.map(cat => cat.categoria)
})

const guardarPagina = () => {
  let categoriaFinal = formulario.value.categoria
  
  if (crearNuevaCategoria.value && nuevaCategoriaNombre.value.trim()) {
    categoriaFinal = nuevaCategoriaNombre.value.trim()
  }
  
  const paginaParaGuardar = {
    ...formulario.value,
    categoria: categoriaFinal
  }
  
  // Agregar la nueva página usando el store
  datosStore.agregarPagina(paginaParaGuardar)
  
  // Limpiar el formulario después de guardar
  formulario.value.nombre = ''
  formulario.value.url = ''
  formulario.value.categoria = ''
  crearNuevaCategoria.value = false
  nuevaCategoriaNombre.value = ''
}
</script>