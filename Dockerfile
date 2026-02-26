FROM node:20 AS base

RUN apt-get update && apt-get install -y curl python3 make g++ build-essential

WORKDIR /app

# Copy package files
COPY package*.json ./

FROM base AS deps
# Install all dependencies with extra options for native modules
RUN npm ci --legacy-peer-deps --no-fund --no-audit

FROM base AS build
# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Remove package-lock.json to force reinstall in container
RUN rm -f package-lock.json

# Reinstall and rebuild native modules specifically for Linux
RUN npm install --legacy-peer-deps
RUN npm rebuild

# Build the application
RUN npm run build

FROM base AS runtime
# Install only production dependencies
RUN npm ci --legacy-peer-deps --only=production --no-fund --no-audit

# Copy built application from build stage
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/worker ./worker
COPY --from=build /app/package*.json ./
COPY --from=build /app/babel.config.js ./

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

CMD ["npm", "start"]