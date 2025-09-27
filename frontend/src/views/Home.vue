<template>
  <div class="container-fluid d-flex flex-column">
    <Header />
    
    <div class="container-fluid d-flex flex-column mt-3">
      <div class="row">
        <draggable 
          v-model="datosStore.datos" 
          item-key="categoria"
          class="d-flex flex-wrap"
          @end="datosStore.guardarOrden"
          handle=".drag-handle"
        >
          <template #item="{ element: categoria }">
            <div :class="datosStore.columnaClase">
              <h5 class="text-white drag-handle" style="cursor: move;">
                <i class="bi bi-grip-vertical me-2" style="cursor: pointer;"></i>
                {{ categoria.categoria }}
              </h5>
              <draggable 
                v-model="categoria.paginas" 
                item-key="id"
                class="d-flex flex-wrap"
                @end="datosStore.guardarOrden"
              >
                <template #item="{ element }">
                  <div class="pagina-item">
                    <div class="pagina-content" @click="abrirPagina(element.url)">
                      <img :src="element.icono" :alt="element.nombre" width="32" height="32" />
                      <span class="text-dark mt-2">{{ element.nombre }}</span>
                    </div>
                    <div class="pagina-actions">
                      <div class="dropdown">
                        <button class="btn btn-sm p-0 text-dark" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                          <i class="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-sm">
                          <li><a class="dropdown-item small" href="#" @click.prevent="editarPagina(element)" data-bs-toggle="modal" data-bs-target="#Modal_Formulario"><i class="bi bi-pencil"></i> Editar</a></li>
                          <li><a class="dropdown-item small" href="#" @click.prevent="eliminarPagina(categoria, element)"><i class="bi bi-trash"></i> Eliminar</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </template>
              </draggable>
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Header from '@/components/Header.vue'
import draggable from 'vuedraggable'
import { useDatosStore } from '@/stores/datos'
import { useDatosModal } from '@/stores/datosmodal'
import '@/assets/css/home.css'

const datosStore = useDatosStore()
const datosModal = useDatosModal()

// Función para abrir una página en la misma pestaña
const abrirPagina = (url) => {
  window.location.href = url
}

// Función para editar una página
const editarPagina = (pagina) => {
  // agregar el nuevo dato
  datosModal.agregarDato(pagina)
  datosModal.EditarDatosFormulario(true)
}

// Función para eliminar una página
const eliminarPagina = (categoria, pagina) => {
  const index = categoria.paginas.indexOf(pagina)
  if (index > -1) {
    categoria.paginas.splice(index, 1)
    datosStore.guardarOrden()
  }
}

onMounted(() => {
  datosStore.cargarDatos()
  datosStore.cargarConfiguracionColumnas()
})
</script>
