# Stage 1: Build the Vite application
FROM node:22-alpine AS build

WORKDIR /app

COPY consent-ledger/package*.json ./
RUN npm ci

COPY consent-ledger/ ./
RUN npm run build

# Stage 2: Serve application with Nginx
FROM nginx:alpine

# Copy static assets from build stage to Nginx web root
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx listens on port 80 by default
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]