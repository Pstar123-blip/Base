FROM node:24-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
COPY api/package.json api/package.json
COPY client/package.json client/package.json
RUN npm ci
COPY . .

FROM dependencies AS build
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build -w client

FROM build AS production
USER node
EXPOSE 8080
CMD ["npm", "run", "preview", "-w", "client"]
