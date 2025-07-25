FROM oven/bun:1.2.19 as base

WORKDIR /app
COPY bun.lock tsconfig.json package.json /app/
RUN bun install --frozen-lockfile
COPY . /app
EXPOSE 8000

CMD bash -c "cd /app && bun run migrate && bun run bot:generate && bun run start"
