# Gunakan base image Node.js
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy file dependensi terlebih dahulu
COPY package*.json ./

# Install dependensi
RUN npm install

# Copy semua file project
COPY . .

# Build aplikasi
RUN npm run build

# Jalankan aplikasi
CMD ["npm", "start"]
