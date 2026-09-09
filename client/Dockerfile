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

FROM nginxinc/nginx-unprivileged:stable-alpine AS production
COPY client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/client/dist /usr/share/nginx/html
EXPOSE 8080
