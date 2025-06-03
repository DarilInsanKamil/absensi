# gunakan node versi terbaru stable
FROM node:20-alpine

# working directory di container
WORKDIR /app

# copy package.json dan package-lock.json dulu untuk caching
COPY package*.json ./

# install dependencies
RUN npm install --force

# copy semua source code
COPY . .

# build nextjs app
RUN npm run build

# expose port
EXPOSE 3000

# jalankan nextjs production
CMD ["npm", "start"]
