FROM node:24.11.0-alpine AS base
WORKDIR /app

# Stage 1: Dependencias
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN corepack enable && corepack prepare pnpm@latest --activate \
    && pnpm install --frozen-lockfile

# Stage 2: Build de la app
FROM base AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm dlx prisma generate
RUN pnpm run build

# Stage 3: Producción
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3000
CMD ["pnpm", "start"]
