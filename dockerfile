FROM oven/bun:alpine AS builder

WORKDIR /app
COPY . .

RUN bun install
RUN bun run build

FROM joseluisq/static-web-server:latest

ENV SERVER_FALLBACK_PAGE=index.html

WORKDIR /

COPY --from=builder /app/dist/ ./public/