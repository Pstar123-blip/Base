FROM node:24-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
COPY api/package.json api/package.json
COPY client/package.json client/package.json
RUN npm ci
COPY . .

FROM dependencies AS build
RUN npm run build -w api
RUN npm prune --omit=dev

FROM node:24-alpine AS production
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/api/dist ./api/dist
COPY --from=build --chown=node:node /app/api/package.json ./api/package.json
USER node
EXPOSE 3000
CMD ["node","api/dist/main.js"]
