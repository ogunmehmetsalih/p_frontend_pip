# Node.js base image
FROM node:18-alpine

# Çalışma dizinini ayarla
WORKDIR /app

# package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Kaynak kodları kopyala
COPY . .

# Environment variables
ENV PORT=3000
ENV NODE_ENV=development
ENV VITE_API_URL=http://localhost:5001

# Port ayarı
EXPOSE 3000

# Uygulamayı başlat
CMD ["npm", "start"] 