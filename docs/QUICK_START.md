# 🚀 Guia de Início Rápido - Frete Inteligente

Este guia irá ajudá-lo a colocar o Frete Inteligente em execução em menos de 10 minutos!

## ⚡ Passo a Passo Rápido

### 1. Verificar Pré-requisitos

Antes de começar, certifique-se de ter instalado:

```bash
# Java 21
java -version

# Maven 3.6+
mvn -version

# Node.js 18+
node -version

# pnpm
pnpm -version

# MySQL 8.0 (rodando na porta 3307)
# Verifique se está rodando
```

### 2. Clonar e Configurar

```bash
# Clone o repositório (se ainda não fez)
git clone <url-do-repositorio>
cd frete-inteligente
```

### 3. Configurar o Banco de Dados

O MySQL deve estar rodando na porta 3307. Se você tem Docker Compose:

```bash
# Inicie o MySQL
docker-compose up -d
```

Se não tem Docker, certifique-se de que o MySQL está rodando com:
- **Porta:** 3307
- **Usuário:** root
- **Senha:** root

### 4. Executar o Backend

```bash
# Na raiz do projeto
mvn clean install
mvn spring-boot:run
```

✅ O backend estará rodando em: `http://localhost:8080`

Teste com: `http://localhost:8080/api/test/status`

### 5. Executar o Frontend

```bash
# Abra um novo terminal
cd transport-app

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8080/api
EOF

# Execute o servidor de desenvolvimento
pnpm dev
```

✅ O frontend estará rodando em: `http://localhost:3000`

### 6. Primeiro Acesso

1. Abra o navegador em `http://localhost:3000`
2. Clique em **"Cadastre-se"**
3. Selecione um tipo de usuário:
   - 🏢 Empresa de Transporte
   - 🚗 Motorista Autônomo
   - 🎓 Cliente/Estudante
4. Preencha os dados:
   - Nome completo
   - Email
   - CPF
   - Telefone
   - Senha (mínimo 6 caracteres)
5. Clique em **"Cadastrar"**
6. Faça login com o email e senha cadastrados
7. Você será redirecionado para o feed!

### 7. Testar Funcionalidades

#### Criar uma Oferta de Transporte

1. No feed, clique no botão **"+"** ou no campo de texto
2. Preencha:
   - **Título:** Ex: "Frete para Unifor"
   - **Região:** Ex: "Maranguape e Maracanaú"
   - **Preço:** Ex: 15.00
   - **Descrição:** Detalhes da oferta
3. Clique em **"Publicar Oferta"**
4. A postagem aparecerá no feed!

#### Criar Dados de Exemplo

```bash
# Usando curl
curl -X POST http://localhost:8080/api/test/dados-exemplo

# Ou acesse no navegador
http://localhost:8080/api/test/dados-exemplo
```

## 🎯 Endpoints Principais

### Backend
```
http://localhost:8080/api
```

### Frontend
```
http://localhost:3000
```

### Rotas do Frontend
- `/` - Página inicial (cadastro)
- `/login` - Login
- `/feed` - Feed de postagens
- `/profile` - Perfil do usuário

### Principais APIs
- `POST /api/auth/login` - Login
- `POST /api/usuarios` - Criar usuário
- `GET /api/postagens` - Listar postagens
- `POST /api/postagens` - Criar postagem
- `GET /api/test/status` - Status do sistema

## 🐛 Problemas Comuns

### Backend não inicia
```bash
# Verifique se o MySQL está rodando
# Windows (PowerShell)
Get-Process mysql

# Linux/Mac
ps aux | grep mysql

# Tente reiniciar o MySQL
docker-compose restart
```

### Frontend não conecta
```bash
# Verifique se o backend está rodando
curl http://localhost:8080/api/test/status

# Verifique o .env.local
cat transport-app/.env.local
```

### Erro de CORS
- Limpe o cache do navegador
- Verifique se o backend está rodando
- Reinicie ambos os servidores

### Porta já em uso
```bash
# Backend (porta 8080)
# Windows (PowerShell)
netstat -ano | findstr :8080

# Linux/Mac
lsof -ti:8080 | xargs kill -9

# Frontend (porta 3000)
# Windows (PowerShell)
netstat -ano | findstr :3000

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

## 📚 Próximos Passos

1. ✅ Explore o feed e crie postagens
2. ✅ Teste o login com diferentes usuários
3. ✅ Leia a [Documentação Técnica](DOCUMENTACAO-TECNICA.md)
4. ✅ Explore os serviços em `transport-app/services/`
5. ✅ Personalize os componentes em `transport-app/components/`

## 🛠️ Comandos Úteis

### Backend
```bash
# Compilar
mvn clean package

# Executar testes
mvn test

# Executar com perfil de desenvolvimento
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Frontend
```bash
# Desenvolvimento
pnpm dev

# Build de produção
pnpm build

# Executar build
pnpm start

# Linting
pnpm lint
```

### Banco de Dados
```bash
# Acessar MySQL via Docker
docker exec -it <container-id> mysql -uroot -proot

# Ver bancos de dados
SHOW DATABASES;

# Usar o banco
USE frete_inteligente;

# Ver tabelas
SHOW TABLES;
```

## 💡 Dicas

1. **Use o navegador em modo desenvolvedor** para ver logs de API
2. **Instale o React DevTools** para debugar componentes
3. **Use o Postman** para testar APIs diretamente
4. **Ative os logs do Spring Boot** para debug do backend
5. **Mantenha ambos os terminais abertos** para ver logs em tempo real

## 📞 Precisa de Ajuda?

- 📖 Leia a [Documentação Técnica Completa](DOCUMENTACAO-TECNICA.md)
- 🐛 Reporte problemas no GitHub Issues
- 💬 Entre em contato com a equipe

---

**Pronto!** 🎉 Você agora tem o Frete Inteligente rodando localmente.

Boa codificação! 🚀

