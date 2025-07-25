FROM oven/bun:1.2.19 as base

WORKDIR /app
COPY bun.lock tsconfig.json package.json /app/
RUN bun install --frozen-lockfile
COPY . /app
EXPOSE 8000

CMD bash -c "bun run migrate --cwd /app && bun run bot:generate --cwd /app && bun run start --cwd /app"
