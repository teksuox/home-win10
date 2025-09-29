const mongoose = require('mongoose');

const paginaSchema = new mongoose.Schema({
  categoria: {
    type: String,
    required: true
  },
  paginas: [{
    id: {
      type: Number,
      required: true
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
    }
  }],
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pagina', paginaSchema);