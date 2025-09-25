const mongoose = require('mongoose');

const paginaSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  icono: {
    type: String,
    required: true
  },
  categoria: {
    type: String,
    required: true
  }
});

const categoriaSchema = new mongoose.Schema({
  categoria: {
    type: String,
    required: true
  },
  paginas: [paginaSchema]
});

module.exports = mongoose.model('Categoria', categoriaSchema);