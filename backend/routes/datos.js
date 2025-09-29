const express = require('express');
const router = express.Router();
const Pagina = require('../models/Pagina');
const jwt = require('jsonwebtoken');

// Middleware para verificar token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_por_defecto');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token inválido' });
  }
};

// Obtener todos los datos (categorías y páginas) del usuario
router.get('/api/datos', verifyToken, async (req, res) => {
  try {
    const paginas = await Pagina.find({ usuario: req.user.id });
    res.json(paginas);
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ message: 'Error al obtener datos' });
  }
});

// Guardar el orden de las páginas del usuario
router.post('/api/datos/orden', verifyToken, async (req, res) => {
  try {
    const { datos } = req.body;
    
    // Eliminar todos los datos existentes del usuario
    await Pagina.deleteMany({ usuario: req.user.id });
    
    // Insertar solo las categorías que tienen páginas
    const datosConPaginas = datos.filter(categoria => 
      categoria.paginas && categoria.paginas.length > 0
    );
    
    // Asociar cada categoría con el usuario
    const datosConUsuario = datosConPaginas.map(categoria => ({
      ...categoria,
      usuario: req.user.id
    }));
    
    if (datosConUsuario.length > 0) {
      await Pagina.insertMany(datosConUsuario);
    }
    
    res.json({ message: 'Orden guardado correctamente' });
  } catch (error) {
    console.error('Error al guardar el orden:', error);
    res.status(500).json({ message: 'Error al guardar el orden' });
  }
});

// Agregar una nueva página al usuario
router.post('/api/datos/pagina', verifyToken, async (req, res) => {
  try {
    const { categoria, pagina } = req.body;
    
    // Buscar la categoría del usuario
    let categoriaDoc = await Pagina.findOne({ categoria, usuario: req.user.id });
    
    if (categoriaDoc) {
      // Si la categoría existe, agregar la página
      categoriaDoc.paginas.push(pagina);
      await categoriaDoc.save();
    } else {
      // Si la categoría no existe, crearla asociada al usuario
      categoriaDoc = new Pagina({
        categoria,
        paginas: [pagina],
        usuario: req.user.id
      });
      await categoriaDoc.save();
    }
    
    res.json({ message: 'Página agregada correctamente', categoria: categoriaDoc });
  } catch (error) {
    console.error('Error al agregar página:', error);
    res.status(500).json({ message: 'Error al agregar página' });
  }
});

// Actualizar una página existente del usuario
router.put('/api/datos/editarpagina', verifyToken, async (req, res) => {
  try {
    const { id, pagina: paginaActualizada } = req.body;
    
    // Buscar todas las categorías del usuario
    const categorias = await Pagina.find({ usuario: req.user.id });
    let paginaEncontrada = false;
    
    // Buscar la página en todas las categorías del usuario
    for (const categoria of categorias) {
      const paginaIndex = categoria.paginas.findIndex(p => p.id == id);
      
      if (paginaIndex !== -1) {
        // Actualizar la página
        categoria.paginas[paginaIndex] = paginaActualizada;
        await categoria.save();
        
        paginaEncontrada = true;
        break;
      }
    }
    
    if (paginaEncontrada) {
      res.json({ message: 'Página actualizada correctamente' });
    } else {
      res.status(404).json({ message: 'Página no encontrada' });
    }
  } catch (error) {
    console.error('Error al actualizar página:', error);
    res.status(500).json({ message: 'Error al actualizar página' });
  }
});

// Eliminar una página del usuario
router.delete('/api/datos/pagina/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar todas las categorías del usuario
    const categorias = await Pagina.find({ usuario: req.user.id });
    let paginaEliminada = false;
    
    // Buscar la página en todas las categorías del usuario
    for (const categoria of categorias) {
      const paginaIndex = categoria.paginas.findIndex(p => p.id == id);
      
      if (paginaIndex !== -1) {
        // Eliminar la página de la categoría
        categoria.paginas.splice(paginaIndex, 1);
        
        // Si la categoría queda sin páginas, eliminarla
        if (categoria.paginas.length === 0) {
          await Pagina.deleteOne({ _id: categoria._id });
        } else {
          await categoria.save();
        }
        
        paginaEliminada = true;
        break;
      }
    }
    
    if (paginaEliminada) {
      res.json({ message: 'Página eliminada correctamente' });
    } else {
      res.status(404).json({ message: 'Página no encontrada' });
    }
  } catch (error) {
    console.error('Error al eliminar página:', error);
    res.status(500).json({ message: 'Error al eliminar página' });
  }
});

// Actualizar configuración de columnas del usuario
router.post('/api/configuracion/columnas', verifyToken, (req, res) => {
  try {
    const { columnas } = req.body;
    // En una implementación real, esto se guardaría en la base de datos asociado al usuario
    // Por ahora, solo confirmamos que se recibió la configuración
    res.json({ message: 'Configuración de columnas guardada', columnas });
  } catch (error) {
    console.error('Error al guardar configuración:', error);
    res.status(500).json({ message: 'Error al guardar configuración' });
  }
});

// Obtener configuración de columnas del usuario
router.get('/api/configuracion/columnas', verifyToken, (req, res) => {
  try {
    // En una implementación real, esto se obtendría de la base de datos del usuario
    // Por ahora, devolvemos un valor por defecto
    res.json({ columnas: 3 });
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    res.status(500).json({ message: 'Error al obtener configuración' });
  }
});

module.exports = router;