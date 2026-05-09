# Stage 1: Build & Dependencies
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Use npm ci for clean, deterministic installs in production
RUN npm ci --only=production

# Stage 2: Production image
FROM node:20-alpine

WORKDIR /app

# Copy node_modules from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Environment variable for production
ENV NODE_ENV=production

EXPOSE 3000

# Run as non-root user for security
USER node

CMD ["npm", "start"]
