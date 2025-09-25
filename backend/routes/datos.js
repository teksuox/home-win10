const express = require('express');
const router = express.Router();
const Categoria = require('../models/Pagina');

// Obtener todos los datos (categorías y páginas)
router.get('/api/datos', async (req, res) => {
  try {
    const categorias = await Categoria.find({});
    res.json(categorias);
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ message: 'Error al obtener datos' });
  }
});

// Guardar el orden de las páginas
router.post('/api/datos/orden', async (req, res) => {
  try {
    const { datos } = req.body;
    
    // Eliminar todos los datos existentes
    await Categoria.deleteMany({});
    
    // Insertar los nuevos datos
    await Categoria.insertMany(datos);
    
    res.json({ message: 'Orden guardado correctamente' });
  } catch (error) {
    console.error('Error al guardar el orden:', error);
    res.status(500).json({ message: 'Error al guardar el orden' });
  }
});

// Agregar una nueva página
router.post('/api/datos/pagina', async (req, res) => {
  try {
    const { categoria, pagina } = req.body;
    
    // Buscar la categoría
    let categoriaDoc = await Categoria.findOne({ categoria });
    
    if (categoriaDoc) {
      // Si la categoría existe, agregar la página
      categoriaDoc.paginas.push(pagina);
      await categoriaDoc.save();
    } else {
      // Si la categoría no existe, crearla
      categoriaDoc = new Categoria({
        categoria,
        paginas: [pagina]
      });
      await categoriaDoc.save();
    }
    
    res.json({ message: 'Página agregada correctamente', categoria: categoriaDoc });
  } catch (error) {
    console.error('Error al agregar página:', error);
    res.status(500).json({ message: 'Error al agregar página' });
  }
});

// Actualizar configuración de columnas
router.post('/api/configuracion/columnas', (req, res) => {
  try {
    const { columnas } = req.body;
    // En una implementación real, esto se guardaría en la base de datos
    // Por ahora, solo confirmamos que se recibió la configuración
    res.json({ message: 'Configuración de columnas guardada', columnas });
  } catch (error) {
    console.error('Error al guardar configuración:', error);
    res.status(500).json({ message: 'Error al guardar configuración' });
  }
});

// Obtener configuración de columnas
router.get('/api/configuracion/columnas', (req, res) => {
  try {
    // En una implementación real, esto se obtendría de la base de datos
    // Por ahora, devolvemos un valor por defecto
    res.json({ columnas: 3 });
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    res.status(500).json({ message: 'Error al obtener configuración' });
  }
});

module.exports = router;