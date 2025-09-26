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

  <ModalConfiguracion />
  <ModalFormulario />
</template>

<script setup>
import { onMounted } from 'vue'
import Header from '@/components/Header.vue'
import ModalConfiguracion from '@/components/Modal_Configuracion.vue'
import ModalFormulario from '@/components/Modal_Formulario.vue'
import draggable from 'vuedraggable'
import { useDatosStore } from '@/stores/datos'

const datosStore = useDatosStore()

// Función para abrir una página en la misma pestaña
const abrirPagina = (url) => {
  window.location.href = url
}

// Función para editar una página
const editarPagina = (pagina) => {
  console.log('Editar página:', pagina)
  // Aquí iría la lógica para editar la página
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

<style scoped>
.pagina-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100px;
  height: 100px;
  padding: 10px;
  margin: 5px;
  background-color: #f8f9fa;
  border-radius: 5px;
  text-align: center;
  position: relative;
}

.pagina-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  cursor: pointer;
}

.pagina-actions {
  position: absolute;
  top: 5px;
  right: 5px;
}

.pagina-item img {
  margin-bottom: 5px;
}

/* Asegurar que los tres puntitos siempre sean negros */
.btn.text-dark {
  color: #000 !important;
}

.btn.text-dark:hover {
  color: #000 !important;
}

.btn.text-dark:focus {
  color: #000 !important;
  box-shadow: none;
}

/* Estilos para el dropdown pequeño */
.dropdown-menu.dropdown-menu-sm {
  min-width: 80px;
  padding: 0.25rem 0;
}

.dropdown-menu.dropdown-menu-sm .dropdown-item {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

.dropdown-menu.dropdown-menu-sm .dropdown-item i {
  font-size: 0.7rem;
}
</style>