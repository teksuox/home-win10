# Etapa 1: Build de la aplicación
FROM node:24.8.0-alpine AS build

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Build para producción
RUN npm run build


# Etapa 2: Servir con Nginx
FROM nginx:1.25-alpine

# Eliminar la config default de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copiar config personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos de build al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer puerto
EXPOSE 80

# Comando para correr Nginx
CMD ["nginx", "-g", "daemon off;"] 
