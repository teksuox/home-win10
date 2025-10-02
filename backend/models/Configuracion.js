const mongoose = require('mongoose');

const configuracionSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  config: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      columnas: 3,
      isImageBackgroundEnabled: false
    }
  }
});

module.exports = mongoose.model('Configuracion', configuracionSchema);