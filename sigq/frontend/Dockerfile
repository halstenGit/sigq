# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json .npmrc ./
RUN npm install

COPY . .

# VITE_* vars são injetadas no bundle em build-time. Railway precisa passar
# VITE_API_URL (apontando para o serviço admin-gateway) como build-arg.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
