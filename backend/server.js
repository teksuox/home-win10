// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const datosRoutes = require('./routes/datos');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:example@mongodb:27017/?authSource=admin';

mongoose.connect(MONGODB_URI);

// Verificar conexión
const db = mongoose.connection;
db.on('error', console.error.bind(console, '❌ Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('✅ Conectado a MongoDB');
});

// Rutas
app.use('/', datosRoutes);

// Endpoint de prueba
app.get('/api/status', (req, res) => {
  if (db.readyState === 1) {
    res.json({ 
      status: 'OK', 
      message: 'Conectado a MongoDB',
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'No conectado a MongoDB',
      timestamp: new Date().toISOString()
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});