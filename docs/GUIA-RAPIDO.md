# 🚀 Guia Rápido - Frete Inteligente

## ⚠️ Pré-requisitos

Antes de começar, você precisa ter instalado:

### 1. Java (JDK 17+)
- ✅ Você já tem! (detectado no sistema)

### 2. Node.js
- ❌ **VOCÊ PRECISA INSTALAR!**
- Baixe em: https://nodejs.org/
- Escolha a versão **LTS** (recomendada)
- Após instalar, **reinicie o terminal**

### 3. Maven
- ✅ Não precisa! (usaremos o Maven Wrapper incluído no projeto)

---

## 🎯 Como Executar (Passo a Passo Simples)

### Passo 1: Iniciar o Backend

1. **Clique duas vezes** no arquivo `INICIAR.bat`
2. Uma janela preta (cmd) vai abrir
3. Aguarde até aparecer a mensagem: `"Started FreteInteligenteApplication"`
4. **Deixe essa janela aberta!**
5. O backend estará rodando em: `http://localhost:8080`

### Passo 2: Instalar Node.js (SE NÃO TIVER)

1. Acesse: https://nodejs.org/
2. Baixe a versão LTS (botão verde)
3. Execute o instalador
4. **Reinicie o VS Code ou o terminal**

### Passo 3: Iniciar o Frontend

Após instalar o Node.js:

1. Abra um **novo terminal** (PowerShell ou cmd)
2. Digite:
```bash
cd transport-app
npm install
npm run dev
```
3. Aguarde até aparecer: `Ready on http://localhost:3000`
4. **Deixe esse terminal aberto!**

### Passo 4: Acessar o Sistema

1. Abra seu navegador
2. Acesse: **http://localhost:3000**
3. Pronto! Você verá a tela de cadastro!

---

## 🧪 Testar a API (Backend)

Depois que o backend estiver rodando, você pode testar a API:

1. Execute no terminal:
```powershell
.\TESTAR-API.ps1
```

Ou teste manualmente:
- Status: http://localhost:8080/api/test/status
- Usuários: http://localhost:8080/api/usuarios

---

## 📋 Arquivos Importantes

- `INICIAR.bat` - Inicia o backend (Spring Boot)
- `TESTAR-API.ps1` - Testa todos os endpoints da API
- `transport-app/` - Código do frontend (Next.js)

---

## ❌ Problemas Comuns

### "mvn não é reconhecido"
✅ **Solução:** Use `INICIAR.bat` ou `mvnw.cmd` em vez de `mvn`

### "npm não é reconhecido"
✅ **Solução:** Instale o Node.js (https://nodejs.org/)

### "Impossível conectar ao servidor"
✅ **Solução:** O backend não está rodando. Execute `INICIAR.bat` primeiro

### Backend não inicia
✅ **Solução:** Verifique se o Java está instalado: `java -version`

---

## 🎉 Primeiro Uso

1. Acesse: http://localhost:3000
2. Escolha o tipo de usuário:
   - **Motorista Autônomo**
   - **Empresa de Transporte**
   - **Cliente/Estudante**
3. Preencha seus dados
4. Clique em "Cadastrar"
5. Faça login com email e senha
6. Pronto! Você está no sistema!

---

## 🛑 Para Parar os Servidores

- **Backend:** Feche a janela cmd ou pressione `Ctrl+C`
- **Frontend:** No terminal, pressione `Ctrl+C`

---

## 📞 Portas Usadas

- Backend (API): **8080**
- Frontend (Web): **3000**
- Banco H2 Console: **8080/h2-console**

---

## 🔍 Console do Banco de Dados H2

Acesse: http://localhost:8080/h2-console

Configurações:
- **JDBC URL:** `jdbc:h2:mem:frete_inteligente`
- **User:** `sa`
- **Password:** (deixe em branco)

---

**Desenvolvido com ❤️ para facilitar o transporte universitário!**

