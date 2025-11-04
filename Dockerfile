FROM node:24.11.0-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN corepack enable && corepack prepare pnpm@latest --activate \
    && pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm dlx prisma generate
RUN pnpm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@latest --activate

# ✅ copiar package.json para que pnpm start funcione
COPY package.json ./
COPY pnpm-lock.yaml ./

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3000
CMD ["pnpm", "start"]
