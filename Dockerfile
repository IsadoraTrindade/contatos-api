FROM node:20-alpine

WORKDIR /app

# Install deps first (better layer caching)
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Env
ENV NODE_ENV=development

EXPOSE 3000

# Default is overridden by compose's command in dev
CMD ["node", "src/server.js"]
