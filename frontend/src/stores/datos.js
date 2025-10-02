import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './login';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const useDatosStore = defineStore('datos', () => {
  const datos = ref([]);
  const authStore = useAuthStore();
  
  // Nuevo estado para la configuración
  const configuracion = ref({
    columnas: 3,
    isImageBackgroundEnabled: false
  });
  const backgroundImageUrl = ref(null);

  // Función para obtener headers con token de autenticación
  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authStore.token}`
    }
  }
  
  // Guardar datos en localStorage
  const guardarEnLocalStorage = (data) => {
    try {
      localStorage.setItem('datosHome', JSON.stringify(data))
    } catch (error) {
      console.error('Error al guardar en localStorage:', error)
    }
  }
  
  // Cargar datos desde localStorage
  const cargarDesdeLocalStorage = () => {
    try {
      const data = localStorage.getItem('datosHome')
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error al cargar desde localStorage:', error)
      return []
    }
  }
  
  // --- NUEVAS FUNCIONES DE CONFIGURACIÓN ---

  const cargarConfiguracion = async () => {
    try {
      // Cargar imagen desde localStorage para acceso rápido
      const storedImage = localStorage.getItem('backgroundImage');
      if (storedImage) {
        backgroundImageUrl.value = storedImage;
      }

      if (!authStore.isAuthenticated) return;

      // Cargar ajustes desde el backend
      const response = await fetch(`${API_BASE_URL}/api/configuracion`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        configuracion.value = await response.json();
      }
    } catch (error) {
      console.error('Error al cargar la configuración:', error);
    }
  };

  const guardarConfiguracion = async (newConfig, imageFile) => {
    try {
      // 1. Guardar la imagen en localStorage si se proporciona una nueva
      if (imageFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Image = e.target.result;
          localStorage.setItem('backgroundImage', base64Image);
          backgroundImageUrl.value = base64Image;
        };
        reader.readAsDataURL(imageFile);
      }

      // 2. Si se desactiva el fondo, no es necesario borrar la imagen de localStorage
      //    así el usuario puede reactivarla sin volver a subirla.

      // 3. Guardar los ajustes en el backend
      if (authStore.isAuthenticated) {
        await fetch(`${API_BASE_URL}/api/configuracion`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ config: newConfig })
        });
      }
      
      // 4. Actualizar el estado local
      configuracion.value = newConfig;

    } catch (error) {
      console.error('Error al guardar la configuración:', error);
    }
  };

  // --- FUNCIONES DE DATOS EXISTENTES ---
  // Cargar datos desde el backend
  const cargarDatos = async () => {
    try {
      // Primero cargar desde localStorage si existen datos
      const localData = cargarDesdeLocalStorage()
      if (localData.length > 0) {
        datos.value = localData
      }
      
      // Verificar si el usuario está autenticado antes de cargar desde backend
      if (!authStore.isAuthenticated) {
        console.warn('Usuario no autenticado, usando datos locales')
        return
      }
      
      // Luego intentar cargar desde el backend
      const response = await fetch(`${API_BASE_URL}/datos`, {
        headers: getAuthHeaders()
      })
      
      if (response.ok) {
        const data = await response.json()
        datos.value = data
        // Guardar en localStorage después de obtener datos del backend
        guardarEnLocalStorage(data)
      } else if (response.status === 401) {
        // Token inválido, cerrar sesión
        authStore.logout()
        throw new Error('Sesión expirada')
      }
    } catch (error) {
      console.error('Error al cargar los datos:', error)
      // Fallback a datos locales si hay error de conexión
      try {
        const localData = cargarDesdeLocalStorage()
        if (localData.length > 0) {
          datos.value = localData
        }
      } catch (localError) {
        console.error('Error al cargar datos locales:', localError)
      }
    }
  }
  
  // Guardar el orden de las páginas en el backend
  const guardarOrden = async () => {
    try {
      if (!authStore.isAuthenticated) {
        throw new Error('Usuario no autenticado')
      }
      
      // Filtrar categorías que tienen páginas
      const datosConPaginas = datos.value.filter(categoria => 
        categoria.paginas && categoria.paginas.length > 0
      );
      
      // Actualizar los datos filtrados
      datos.value = datosConPaginas;
      
      const response = await fetch(`${API_BASE_URL}/datos/orden`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ datos: datos.value })
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          authStore.logout()
          throw new Error('Sesión expirada')
        }
        throw new Error('Error al guardar el orden')
      }
      
      const result = await response.json()
      console.log('Orden guardado:', result.message)
      // Guardar en localStorage después de guardar en backend
      guardarEnLocalStorage(datos.value)
    } catch (error) {
      console.error('Error al guardar el orden:', error)
      // Guardar en localStorage incluso si falla el backend
      guardarEnLocalStorage(datos.value)
      throw error
    }
  }
  
  // Agregar una nueva página
  const agregarPagina = async (nuevaPagina) => {
    try {
      if (!authStore.isAuthenticated) {
        throw new Error('Usuario no autenticado')
      }
      
      const response = await fetch(`${API_BASE_URL}/datos/pagina`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          categoria: nuevaPagina.categoria,
          pagina: {
            id: Date.now(),
            nombre: nuevaPagina.nombre,
            url: nuevaPagina.url,
            icono: `https://www.google.com/s2/favicons?domain=${new URL(nuevaPagina.url).hostname}&sz=64`,
            categoria: nuevaPagina.categoria
          }
        })
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          authStore.logout()
          throw new Error('Sesión expirada')
        }
        throw new Error('Error al agregar página')
      }
      
      const result = await response.json()
      console.log('Página agregada:', result.message)
      
      // Recargar los datos para reflejar los cambios
      await cargarDatos()
    } catch (error) {
      console.error('Error al agregar página:', error)
      // Guardar datos actuales en localStorage incluso si falla el backend
      guardarEnLocalStorage(datos.value)
      throw error
    }
  }
  
  // Actualizar una página existente
  const actualizarPagina = async (paginaActualizada) => {
    try {
      if (!authStore.isAuthenticated) {
        throw new Error('Usuario no autenticado')
      }
      
      const response = await fetch(`${API_BASE_URL}/datos/editarpagina`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          id: paginaActualizada.id,
          pagina: paginaActualizada
        })
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          authStore.logout()
          throw new Error('Sesión expirada')
        }
        throw new Error('Error al actualizar página')
      }
      
      const result = await response.json()
      console.log('Página actualizada:', result.message)
      
      // Recargar los datos para reflejar los cambios
      await cargarDatos()
    } catch (error) {
      console.error('Error al actualizar página:', error)
      // Guardar datos actuales en localStorage incluso si falla el backend
      guardarEnLocalStorage(datos.value)
      throw error
    }
  }
  
  // Obtener lista de categorías
  const categorias = computed(() => {
    return datos.value.map(item => ({
      categoria: item.categoria
    }))
  })
  
  return {
    datos,
    configuracion, // <-- Exponer configuración
    backgroundImageUrl, // <-- Exponer URL de la imagen
    categorias,
    cargarDatos,
    guardarOrden,
    agregarPagina,
    actualizarPagina,
    cargarConfiguracion, // <-- Exponer nueva función
    guardarConfiguracion // <-- Exponer nueva función
  }
})