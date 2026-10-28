# API

See the [workspace guide](../README.md) for setup and architecture.

`npm run dev`, `build`, `typecheck`, `lint`, `format`, `test`, `test:e2e`, `openapi`, `db:generate`, `db:migrate`, `db:studio`, and `docker-build` are available from this directory. Copy .env.example to .env for Docker development; its database hostname is db. Run development migrations with `docker compose -f docker-compose-dev.yml run --rm migrate` from the root. Production migrations are run by the Compose migration service.
