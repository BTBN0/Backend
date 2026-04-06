# Stage 1: dependencies
FROM node:20-alpine AS deps

WORKDIR /app
COPY package*.json ./
RUN npm install

# Stage 2: development
FROM node:20-alpine AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]