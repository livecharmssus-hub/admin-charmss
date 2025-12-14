# Etapa 1: Construcción (Builder)
# Usamos una imagen oficial de Node.js (versión LTS Alpine para un tamaño menor)
FROM node:20-alpine AS builder

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos package.json y package-lock.json para cachear las dependencias
COPY package*.json ./

# Instalamos las dependencias de forma limpia usando el lockfile
RUN npm ci

# Copiamos el resto del código fuente de la aplicación
COPY . .

# Construimos la aplicación para producción
# Esto creará una carpeta /app/dist con los archivos estáticos
RUN npm run build

# Etapa 2: Servidor de Producción (Production)
# Usamos una imagen de Nginx estable y ligera
FROM nginx:stable-alpine

# Copiamos los archivos estáticos construidos desde la etapa 'builder'
# al directorio por defecto de Nginx para servir contenido HTML
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponemos el puerto 80, que es el puerto por defecto de Nginx
EXPOSE 80

# El comando por defecto de la imagen de Nginx ya inicia el servidor,
# por lo que no necesitamos un CMD explícito.
