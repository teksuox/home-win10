<template>
  <div class="container-fluid d-flex flex-column h-100">
    <Header />
    
    <!-- modo escritorio -->
    <div class="container-fluid d-flex flex-column mt-3 flex-grow-1">
      <div class="row d-none d-md-flex h-10">
        <Marcadores />
      </div>

      <div class="row d-none d-md-flex justify-content-center h-90">
        <div class="col-12">
          <draggable 
            v-model="datosStore.datos" 
            item-key="categoria"
            class="d-flex flex-wrap justify-content-center gap-4 w-100"
            @end="datosStore.guardarOrden"
            handle=".drag-handle"
          >
            <template #item="{ element: categoria }">
              <div :class="getCategoriaClass()" :key="categoria.categoria">
                <h5 class="text-white drag-handle text-center" style="cursor: move;">
                  <i class="bi bi-grip-vertical me-2" style="cursor: pointer;"></i>
                  {{ categoria.categoria }}
                </h5>
                <div class="d-flex flex-wrap justify-content-center gap-2">
                  <draggable 
                    v-model="categoria.paginas" 
                    item-key="id"
                    class="d-flex flex-wrap justify-content-center gap-2"
                    @end="datosStore.guardarOrden"
                    :delay="200"
                    :delay-on-touch-only="true"
                  >
                    <template #item="{ element }">
                      <div class="pagina-item">
                        <a :href="element.url" class="pagina-content" style="text-decoration: none; color: inherit;">
                          <img :src="element.icono" :alt="element.nombre" width="32" height="32" />
                          <span class="text-dark mt-2">{{ element.nombre }}</span>
                        </a>
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
              </div>
            </template>
          </draggable>
        </div>
      </div>

      <!-- modo mobil -->
       <div class="row d-md-none justify-content-center h-100">
        <div class="col-12">
          <draggable 
            v-model="datosStore.datos" 
            item-key="categoria"
            class="d-flex flex-wrap justify-content-start  gap-4 w-100"
            @end="datosStore.guardarOrden"
            handle=".drag-handle"
          >
            <template #item="{ element: categoria }">
              <div :key="categoria.categoria">
                <h5 class="text-white drag-handle text-start " style="cursor: move;">
                  <i class="bi bi-grip-vertical me-2" style="cursor: pointer;"></i>
                  {{ categoria.categoria }}
                </h5>
                <div class="d-flex flex-wrap justify-content-start  gap-2">
                  <draggable 
                    v-model="categoria.paginas" 
                    item-key="id"
                    class="d-flex flex-wrap justify-content-start  gap-2"
                    @end="datosStore.guardarOrden"
                    :delay="200"
                    :delay-on-touch-only="true"
                  >
                    <template #item="{ element }">
                      <div class="pagina-item">
                        <a :href="element.url" class="pagina-content" style="text-decoration: none; color: inherit;">
                          <img :src="element.icono" :alt="element.nombre" width="32" height="32" />
                          <span class="text-dark mt-2">{{ element.nombre }}</span>
                        </a>
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
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Header from '@/components/Header.vue'
import Marcadores from '@/views/Marcadores.vue'
import draggable from 'vuedraggable'
import { useDatosStore } from '@/stores/datos'
import { useDatosModal } from '@/stores/datosmodal'
import '@/assets/css/home.css'

const datosStore = useDatosStore()
const datosModal = useDatosModal()

// Función para obtener la clase de columna según el número de categorías
const getCategoriaClass = () => {
  const numCategorias = datosStore.datos.length;
  
  // Definir clases de columna según el número de categorías
  if (numCategorias === 1) {
    return 'col-12 col-md-8 col-lg-6 mb-4 categoria-container';
  } else if (numCategorias === 2) {
    return 'col-12 col-md-6 col-lg-5 mb-4 categoria-container';
  } else if (numCategorias === 3) {
    return 'col-12 col-md-3 col-lg-3 mb-3 categoria-container';
  } else if (numCategorias === 4) {
    return 'col-12 col-md-6 col-lg-3 mb-4 categoria-container';
  } else {
    // Para 5 o más categorías, usar un tamaño fijo más pequeño
    return 'col-12 col-md-4 col-lg-3 mb-4 categoria-container';
  }
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
})
</script>
