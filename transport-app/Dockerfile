# Dockerfile para o Frontend (Next.js)
FROM node:22-alpine AS base

# Instalar dependências apenas quando necessário
FROM base AS deps
WORKDIR /app

# Copiar package files
COPY package.json pnpm-lock.yaml* ./

# Instalar dependências (sem frozen-lockfile para atualizar automaticamente)
RUN npm install -g pnpm && \
    pnpm install --no-frozen-lockfile

# Rebuild apenas quando necessário
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Criar arquivo .env.local para build
ENV NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Build Next.js
RUN npm install -g pnpm && \
    pnpm run build

# Imagem de produção
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos necessários
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

