# ✅ Checklist de Integração - Frete Inteligente

Use este checklist para verificar se tudo está funcionando corretamente após a integração.

---

## 🔧 Pré-requisitos

- [ ] Java 21 instalado e funcionando
- [ ] Maven 3.6+ instalado
- [ ] MySQL 8.0 rodando na porta 3307
- [ ] Node.js 18+ instalado
- [ ] pnpm instalado (ou npm)
- [ ] Portas 3000 e 8080 disponíveis

---

## 🗄️ Banco de Dados

- [ ] MySQL está rodando
- [ ] Porta 3307 está acessível
- [ ] Credenciais root/root estão corretas
- [ ] Banco `frete_inteligente` será criado automaticamente

**Teste:**
```bash
# Via Docker Compose
docker-compose ps

# Ou conexão direta
mysql -h localhost -P 3307 -u root -proot
```

---

## 🔙 Backend (Spring Boot)

### Compilação e Execução

- [ ] Projeto compila sem erros: `mvn clean install`
- [ ] Backend inicia sem erros: `mvn spring-boot:run`
- [ ] Backend rodando em `http://localhost:8080`
- [ ] Migrations do Flyway executadas com sucesso

### Endpoints Funcionando

- [ ] `GET http://localhost:8080/api/test/status` retorna status
- [ ] `POST http://localhost:8080/api/test/dados-exemplo` cria dados de exemplo
- [ ] `GET http://localhost:8080/api/usuarios` retorna lista (vazia ou com dados)
- [ ] `GET http://localhost:8080/api/postagens` retorna lista

### Arquivos Backend Criados

- [ ] `src/main/java/.../controller/AuthController.java` existe
- [ ] `src/main/java/.../config/CorsConfig.java` existe
- [ ] CORS está configurado corretamente

**Teste de API:**
```bash
# Status
curl http://localhost:8080/api/test/status

# Criar dados de exemplo
curl -X POST http://localhost:8080/api/test/dados-exemplo

# Listar usuários
curl http://localhost:8080/api/usuarios

# Listar postagens
curl http://localhost:8080/api/postagens
```

---

## 🎨 Frontend (Next.js)

### Instalação e Configuração

- [ ] Dependências instaladas: `cd transport-app && pnpm install`
- [ ] Arquivo `.env.local` criado com `NEXT_PUBLIC_API_URL=http://localhost:8080/api`
- [ ] Frontend inicia sem erros: `pnpm dev`
- [ ] Frontend rodando em `http://localhost:3000`
- [ ] Sem erros no console do navegador

### Arquivos Frontend Criados

- [ ] `transport-app/types/index.ts` existe
- [ ] `transport-app/lib/api-client.ts` existe
- [ ] `transport-app/services/usuario.service.ts` existe
- [ ] `transport-app/services/postagem.service.ts` existe
- [ ] `transport-app/services/viagem.service.ts` existe
- [ ] `transport-app/services/checkin.service.ts` existe
- [ ] `transport-app/contexts/AuthContext.tsx` existe
- [ ] `transport-app/.env.local` existe

### Componentes Atualizados

- [ ] `transport-app/app/layout.tsx` tem AuthProvider
- [ ] `transport-app/components/login-form.tsx` usa useAuth
- [ ] `transport-app/components/registration-form.tsx` chama API
- [ ] `transport-app/components/feed-layout.tsx` carrega da API
- [ ] `transport-app/components/create-post-modal.tsx` cria postagens

---

## 🧪 Testes Funcionais

### 1. Registro de Usuário

- [ ] Acesse `http://localhost:3000`
- [ ] Página de cadastro carrega
- [ ] Clique em "Cadastre-se" (se estiver na home)
- [ ] Selecione tipo "Cliente/Estudante"
- [ ] Preencha todos os campos:
  - Nome: "João Silva"
  - Email: "joao@teste.com"
  - CPF: "12345678901"
  - Telefone: "(85) 99999-9999"
  - Senha: "senha123"
- [ ] Clique em "Cadastrar"
- [ ] Toast de sucesso aparece
- [ ] Redirecionado para `/login`
- [ ] Verifique no backend: `curl http://localhost:8080/api/usuarios`

**Status:** ⬜ Passou | ⬜ Falhou

---

### 2. Login

- [ ] Acesse `http://localhost:3000/login`
- [ ] Digite email: "joao@teste.com"
- [ ] Digite senha: "senha123"
- [ ] Clique em "Entrar"
- [ ] Toast de sucesso aparece
- [ ] Redirecionado para `/feed`
- [ ] Nome do usuário aparece no sidebar

**Status:** ⬜ Passou | ⬜ Falhou

---

### 3. Feed de Postagens

- [ ] Feed carrega sem erros
- [ ] Se vazio, mensagem "Nenhuma postagem disponível" aparece
- [ ] Se houver postagens, elas aparecem corretamente
- [ ] Avatar do usuário aparece no topo
- [ ] Nome do usuário está correto
- [ ] Tipo do usuário está correto

**Status:** ⬜ Passou | ⬜ Falhou

---

### 4. Criar Postagem

- [ ] No feed, clique no botão "+" ou no campo de texto
- [ ] Modal "Criar publicação" abre
- [ ] Preencha:
  - Título: "Transporte para Unifor"
  - Região: "Fortaleza"
  - Preço: 15.00
  - Descrição: "Transporte seguro e confiável"
- [ ] Clique em "Publicar Oferta"
- [ ] Toast de sucesso aparece
- [ ] Modal fecha
- [ ] Nova postagem aparece no feed
- [ ] Dados da postagem estão corretos

**Status:** ⬜ Passou | ⬜ Falhou

---

### 5. Logout

- [ ] Clique no botão de logout (ícone de saída)
- [ ] Redirecionado para `/login`
- [ ] Ao tentar acessar `/feed`, é redirecionado para `/login`
- [ ] LocalStorage foi limpo (inspecione no DevTools)

**Status:** ⬜ Passou | ⬜ Falhou

---

### 6. Criar Múltiplos Usuários

- [ ] Registre usuário tipo "Empresa"
- [ ] Registre usuário tipo "Motorista Autônomo"
- [ ] Faça login com cada um
- [ ] Crie postagens com diferentes usuários
- [ ] Postagens mostram o autor correto

**Status:** ⬜ Passou | ⬜ Falhou

---

## 🔍 Testes de API Direta

### Autenticação

```bash
# Login com usuário existente
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@teste.com",
    "password": "senha123"
  }'
```

- [ ] Retorna status 200
- [ ] Retorna objeto com `usuario` e `token`

---

### Criar Usuário

```bash
curl -X POST http://localhost:8080/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "EMPRESA",
    "nome": "Transportes XYZ",
    "email": "xyz@transportes.com",
    "cpf": "98765432100",
    "telefone": "85988887777",
    "senhaHash": "senha123"
  }'
```

- [ ] Retorna status 200
- [ ] Retorna usuário criado com ID

---

### Criar Postagem

```bash
# Primeiro, pegue o ID de um usuário
USER_ID=$(curl -s http://localhost:8080/api/usuarios | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)

curl -X POST http://localhost:8080/api/postagens \
  -H "Content-Type: application/json" \
  -d "{
    \"autor\": {\"id\": $USER_ID},
    \"titulo\": \"Oferta Teste\",
    \"regiao\": \"Fortaleza\",
    \"descricao\": \"Descrição teste\",
    \"preco\": 20.00
  }"
```

- [ ] Retorna status 200
- [ ] Retorna postagem criada

---

## 🌐 Testes de Integração Frontend-Backend

### CORS

- [ ] Abra DevTools (F12)
- [ ] Vá para a aba Network
- [ ] Faça login no frontend
- [ ] Verifique que a requisição para `/api/auth/login` tem status 200
- [ ] Não há erros de CORS no console

---

### Comunicação em Tempo Real

- [ ] Crie uma postagem no frontend
- [ ] Abra outra aba do navegador
- [ ] Faça login com outro usuário
- [ ] Recarregue o feed
- [ ] A postagem criada no primeiro usuário aparece

---

### Estado de Autenticação

- [ ] Faça login
- [ ] Recarregue a página (F5)
- [ ] Usuário continua logado
- [ ] Dados do usuário persistem

---

## 📊 Verificação de Documentação

- [ ] `README.md` atualizado
- [ ] `DOCUMENTACAO-TECNICA.md` atualizada
- [ ] `QUICK_START.md` criado
- [ ] `INTEGRACAO-RESUMO.md` criado
- [ ] `transport-app/README.md` criado
- [ ] `.env.example` existe

---

## 🐛 Troubleshooting

### Se o backend não iniciar:

```bash
# Verifique o MySQL
docker-compose ps

# Verifique logs do Maven
mvn spring-boot:run

# Limpe e recompile
mvn clean install
```

### Se o frontend não conectar:

```bash
# Verifique .env.local
cat transport-app/.env.local

# Reinstale dependências
cd transport-app
rm -rf node_modules .next
pnpm install

# Verifique se backend está rodando
curl http://localhost:8080/api/test/status
```

### Se houver erro de CORS:

- [ ] Verifique se `CorsConfig.java` existe
- [ ] Reinicie o backend
- [ ] Limpe cache do navegador
- [ ] Teste em modo anônimo

---

## ✅ Critérios de Sucesso

Para considerar a integração completa e funcional, todos os itens abaixo devem estar ✅:

- [ ] Backend compila e executa sem erros
- [ ] Frontend compila e executa sem erros
- [ ] Registro de usuário funciona
- [ ] Login funciona
- [ ] Feed carrega postagens da API
- [ ] Criar postagem funciona
- [ ] Logout funciona
- [ ] Não há erros no console do navegador
- [ ] Não há erros de CORS
- [ ] Dados persistem no banco de dados
- [ ] Documentação está completa

---

## 🎯 Resultado Final

**Total de Testes:** _____ / _____  
**Taxa de Sucesso:** _____%  

**Status Geral:**
- ⬜ ✅ Tudo funcionando perfeitamente
- ⬜ ⚠️ Funciona com pequenos problemas
- ⬜ ❌ Problemas críticos encontrados

**Observações:**
```
_____________________________________________________
_____________________________________________________
_____________________________________________________
```

---

## 📞 Próximos Passos

Se todos os testes passaram:
1. ✅ Comece a desenvolver novas funcionalidades
2. ✅ Explore o código e personalize
3. ✅ Leia a documentação técnica completa

Se houver problemas:
1. ❌ Consulte a seção de Troubleshooting
2. ❌ Verifique os logs do backend e frontend
3. ❌ Revise a documentação
4. ❌ Entre em contato com a equipe

---

**Data da Verificação:** _____________________  
**Verificado por:** _____________________  
**Versão:** 2.0.0

