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

# Copiar package files
COPY package.json pnpm-lock.yaml* ./

# Copiar dependências do stage anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fonte de forma seletiva (evitando node_modules)
COPY app ./app
COPY components ./components
COPY contexts ./contexts
COPY hooks ./hooks
COPY lib ./lib
COPY public ./public
COPY services ./services
COPY styles ./styles
COPY types ./types
# Garantir que globals.css seja copiado (está em app/globals.css)

# Copiar arquivos de configuração
COPY next.config.mjs ./
COPY postcss.config.mjs ./
COPY tsconfig.json ./
COPY components.json ./

# Copiar .dockerignore e outros arquivos de configuração se existirem
COPY .dockerignore* ./
COPY .gitignore* ./

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

# Copiar arquivos necessários do build standalone
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
