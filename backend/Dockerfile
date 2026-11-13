# ---------- Stage 1: build the app ----------
# Start from a ready made Linux image that already has Node 24
FROM node:24-slim AS build

# All following commands run inside this folder in the image
WORKDIR /app

# Copy only the package files first (see note below)
COPY package.json package-lock.json ./

# Install ALL packages, including TypeScript, because we need it to build
RUN npm ci

# Now copy the code and compile TypeScript into JavaScript (the dist folder)
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---------- Stage 2: the final, small image ----------
# Start again from a clean Node image, leaving stage 1 behind
FROM node:24-slim

   LABEL org.opencontainers.image.source="https://github.com/mqasim434/splitwise_clone"

# Makes Express and other libraries run in their faster production mode
ENV NODE_ENV=production

WORKDIR /app

# Install only the packages the app needs to RUN (no TypeScript)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Take only the compiled output from stage 1
COPY --from=build /app/dist ./dist

# Run as the normal "node" user instead of root
USER node

# A note saying the app listens on port 3000
EXPOSE 3000

# The command that starts the app when the container starts
CMD ["node", "dist/index.js"]