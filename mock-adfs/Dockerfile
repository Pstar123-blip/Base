FROM node:24-alpine
ENV NODE_ENV=development
ENV MOCK_ADFS_PORT=4000
WORKDIR /app
COPY --chown=node:node . .
USER node
EXPOSE 4000
CMD ["node", "server.mjs"]
