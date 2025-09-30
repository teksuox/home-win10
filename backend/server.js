const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const datosRoutes = require('./routes/datos');

const app = express();
const PORT = process.env.PORT || 3001;

// Lista de dominios permitidos
const allowedOrigins = [
  'https://www.home.ts',
  'https://home.ts',
  'http://www.home.ts',
  'http://home.ts'
  
];

// Configuración de CORS
app.use(cors({
  origin: function (origin, callback) {
    // Si no hay origin (ej: Postman) o está en la lista, lo permitimos
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Middleware para JSON
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/home', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

// Rutas
app.use('/', authRoutes);
app.use('/', datosRoutes);

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
