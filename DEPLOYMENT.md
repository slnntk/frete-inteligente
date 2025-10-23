# 🚀 Guia de Deploy - Frete Inteligente

Este guia cobre o processo completo de deploy do sistema Frete Inteligente em produção.

## 📋 Checklist Pré-Deploy

Antes de fazer deploy em produção, certifique-se de:

- [ ] Todos os testes passaram
- [ ] Vulnerabilidades de segurança corrigidas
- [ ] Variáveis de ambiente configuradas
- [ ] Backup do banco de dados configurado
- [ ] Monitoramento configurado
- [ ] SSL/TLS certificados obtidos
- [ ] Domínio configurado
- [ ] Documentação atualizada

## 🖥️ Deploy do Backend

### Opção 1: Deploy em VPS (Ubuntu/Debian)

#### 1. Preparar o Servidor

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Instalar nginx
sudo apt install -y nginx

# Instalar PM2
sudo npm install -g pm2
```

#### 2. Configurar PostgreSQL

```bash
# Acessar PostgreSQL
sudo -u postgres psql

# Criar database e usuário
CREATE DATABASE frete_inteligente;
CREATE USER frete_user WITH PASSWORD 'senha_segura_aqui';
GRANT ALL PRIVILEGES ON DATABASE frete_inteligente TO frete_user;
\q

# Configurar para aceitar conexões locais
sudo nano /etc/postgresql/14/main/pg_hba.conf
# Adicionar: local all frete_user md5
sudo systemctl restart postgresql
```

#### 3. Deploy da Aplicação

```bash
# Clone o repositório
cd /var/www
sudo git clone https://github.com/slnntk/frete-inteligente.git
cd frete-inteligente/backend

# Instalar dependências
sudo npm install --production

# Configurar variáveis de ambiente
sudo nano .env
```

Configuração `.env` de produção:
```env
PORT=3000
NODE_ENV=production

DB_HOST=localhost
DB_PORT=5432
DB_NAME=frete_inteligente
DB_USER=frete_user
DB_PASSWORD=senha_segura_aqui

JWT_SECRET=gere_uma_chave_aleatoria_muito_segura_aqui
JWT_EXPIRES_IN=24h

CORS_ORIGIN=https://seudominio.com,https://www.seudominio.com
```

```bash
# Iniciar com PM2
pm2 start src/server.js --name frete-backend

# Configurar PM2 para iniciar no boot
pm2 startup
pm2 save

# Ver logs
pm2 logs frete-backend

# Monitorar
pm2 monit
```

#### 4. Configurar Nginx como Proxy Reverso

```bash
sudo nano /etc/nginx/sites-available/frete-inteligente
```

Configuração:
```nginx
server {
    listen 80;
    server_name api.seudominio.com;

    # Redirecionar HTTP para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.seudominio.com;

    # SSL Certificates (obter com Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/api.seudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.seudominio.com/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Logs
    access_log /var/log/nginx/frete-api-access.log;
    error_log /var/log/nginx/frete-api-error.log;

    # Proxy para a aplicação Node.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket support for Socket.IO
    location /socket.io/ {
        proxy_pass http://localhost:3000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Habilitar site
sudo ln -s /etc/nginx/sites-available/frete-inteligente /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Reiniciar nginx
sudo systemctl restart nginx
```

#### 5. Configurar SSL com Let's Encrypt

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d api.seudominio.com

# Configurar renovação automática
sudo certbot renew --dry-run
```

### Opção 2: Deploy com Docker

#### 1. Preparar o Servidor

```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 2. Deploy com Docker Compose

```bash
# Clone o repositório
git clone https://github.com/slnntk/frete-inteligente.git
cd frete-inteligente

# Configurar .env
cp backend/.env.example backend/.env
nano backend/.env

# Build e start
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down

# Rebuild após mudanças
docker-compose up -d --build
```

### Opção 3: Deploy em Cloud (AWS/GCP/Azure)

#### AWS Elastic Beanstalk

```bash
# Instalar EB CLI
pip install awsebcli

# Inicializar
eb init -p node.js-18 frete-inteligente

# Criar ambiente
eb create frete-production

# Deploy
eb deploy

# Ver logs
eb logs

# Abrir no navegador
eb open
```

#### Heroku

```bash
# Login
heroku login

# Criar app
heroku create frete-inteligente-api

# Adicionar PostgreSQL
heroku addons:create heroku-postgresql:mini

# Configurar variáveis
heroku config:set JWT_SECRET=sua_chave_secreta
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Ver logs
heroku logs --tail

# Abrir
heroku open
```

## 📱 Deploy do App Mobile

### Build Android

```bash
cd transport-app

# Configurar API URL para produção
# Editar src/services/api.js
const API_BASE_URL = 'https://api.seudominio.com/api';

# Build APK
expo build:android

# Ou com EAS
eas build --platform android
```

### Build iOS

```bash
# Build IPA
expo build:ios

# Ou com EAS
eas build --platform ios
```

### Publicar nas Lojas

#### Google Play Store

1. Criar conta de desenvolvedor ($25 uma vez)
2. Criar aplicativo no console
3. Upload do APK/AAB
4. Preencher informações da loja
5. Configurar preços e distribuição
6. Enviar para revisão

#### Apple App Store

1. Criar conta de desenvolvedor ($99/ano)
2. Criar app no App Store Connect
3. Upload do IPA
4. Preencher informações da loja
5. Configurar preços e disponibilidade
6. Enviar para revisão

## 🔒 Segurança em Produção

### Backend

1. **Variáveis de Ambiente**
```bash
# NUNCA commitar .env
# Usar secrets do cloud provider
# Ou usar serviços como HashiCorp Vault
```

2. **Rate Limiting**
```bash
npm install express-rate-limit

# Adicionar em server.js
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo de requisições
});
app.use('/api/', limiter);
```

3. **Helmet para Headers de Segurança**
```bash
npm install helmet

// Adicionar em server.js
const helmet = require('helmet');
app.use(helmet());
```

4. **HTTPS Obrigatório**
```javascript
// Redirecionar HTTP para HTTPS
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

### App Mobile

1. **API URL Segura (HTTPS)**
2. **Obfuscar código**: `expo build:android --release-channel production`
3. **Remover console.logs**: Usar babel-plugin-transform-remove-console
4. **Configurar App Transport Security (iOS)**

## 📊 Monitoramento

### Backend

```bash
# PM2 Monitoring
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# Instalar serviço de monitoramento
# - New Relic
# - DataDog
# - Sentry para erros
npm install @sentry/node
```

### Database

```bash
# Backup automático
sudo nano /etc/cron.daily/backup-postgres

#!/bin/bash
pg_dump -U frete_user frete_inteligente > /backups/frete_$(date +%Y%m%d).sql
find /backups/ -type f -mtime +7 -delete

# Tornar executável
sudo chmod +x /etc/cron.daily/backup-postgres
```

## 🧪 Testes em Produção

```bash
# Health check
curl https://api.seudominio.com

# Teste de autenticação
curl -X POST https://api.seudominio.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Teste de endpoint protegido
curl https://api.seudominio.com/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

## 📈 Escalabilidade

### Load Balancer

Use nginx ou cloud load balancer para distribuir tráfego entre múltiplas instâncias:

```nginx
upstream backend {
    least_conn;
    server backend1.seudominio.com:3000;
    server backend2.seudominio.com:3000;
    server backend3.seudominio.com:3000;
}

server {
    location / {
        proxy_pass http://backend;
    }
}
```

### Database

- Configure réplicas de leitura
- Use connection pooling (já configurado no Sequelize)
- Considere cache com Redis

## 🔄 CI/CD

### GitHub Actions

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/frete-inteligente
            git pull
            cd backend
            npm install --production
            pm2 restart frete-backend
```

## 📝 Checklist Pós-Deploy

- [ ] Backend rodando sem erros
- [ ] Database acessível
- [ ] SSL/HTTPS funcionando
- [ ] App mobile conectando ao backend
- [ ] WebSocket funcionando
- [ ] Backups configurados
- [ ] Monitoramento ativo
- [ ] Logs sendo coletados
- [ ] DNS configurado corretamente
- [ ] Performance testada
- [ ] Load testing realizado

## 🆘 Troubleshooting

### Backend não inicia
```bash
pm2 logs frete-backend --lines 100
# Verificar erros de conexão com DB
# Verificar variáveis de ambiente
```

### Database connection failed
```bash
# Testar conexão
psql -h localhost -U frete_user -d frete_inteligente
# Verificar credenciais no .env
```

### App não conecta ao backend
- Verificar CORS no backend
- Verificar URL do API no app
- Verificar certificado SSL
- Verificar firewall

---

**Parabéns!** Seu sistema Frete Inteligente está em produção! 🎉

Para suporte: abra uma issue no GitHub ou consulte a documentação.
