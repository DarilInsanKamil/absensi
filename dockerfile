# # gunakan node versi terbaru stable
# FROM node:20-alpine

# # working directory di container
# WORKDIR /app

# # copy package.json dan package-lock.json dulu untuk caching
# COPY package*.json ./

# # install dependencies
# RUN npm install --force

# # copy semua source code
# COPY . .

# # build nextjs app
# RUN npm run build

# # expose port
# EXPOSE 3000

# # jalankan nextjs production
# CMD ["npm", "start"]



# Step 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies
COPY package*.json ./
COPY .env.local .env.local
RUN npm install --force

# Copy the rest of the app
COPY . .
# Build Next.js in standalone mode
RUN npm run build

# Step 2: Production image
FROM node:20-alpine

WORKDIR /app

# Copy the standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# (Optional) Copy env file if needed
COPY --from=builder /app/.env.local .env.local

EXPOSE 3000

# Start Next.js standalone server
CMD ["node", "server.js"]
