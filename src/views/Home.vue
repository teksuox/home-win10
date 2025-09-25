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
                <i class="bi bi-grip-vertical me-2"></i>
                {{ categoria.categoria }}
              </h5>
              <draggable 
                v-model="categoria.paginas" 
                item-key="id"
                class="d-flex flex-wrap"
                @end="datosStore.guardarOrden"
              >
                <template #item="{ element }">
                  <div class="pagina-item" @click="abrirPagina(element.url)">
                    <img :src="element.icono" :alt="element.nombre" width="32" height="32" />
                    <span class="text-dark mt-2">{{ element.nombre }}</span>
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

onMounted(() => {
  datosStore.cargarDatos()
  datosStore.cargarConfiguracionColumnas()
})
</script>

<style scoped>
.pagina-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  padding: 10px;
  margin: 5px;
  background-color: #f8f9fa;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
}

.pagina-item img {
  margin-bottom: 5px;
}
</style>