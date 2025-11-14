# 🔧 Soluções para Executar o Backend

## ❌ Problema Identificado

O **Maven Wrapper** (`mvnw.cmd`) está com problemas no seu sistema porque não consegue executar PowerShell internamente.

---

## ✅ SOLUÇÃO 1: Instalar Maven (Recomendado - 5 minutos)

### Passo a Passo:

1. **Baixe o Maven:**
   - Acesse: https://maven.apache.org/download.cgi
   - Baixe: `apache-maven-3.9.6-bin.zip`

2. **Extraia o arquivo:**
   - Extraia para: `C:\Program Files\Apache\Maven`
   - Ou qualquer pasta de sua preferência

3. **Adicione ao PATH:**
   - Pressione `Win + R`
   - Digite: `sysdm.cpl` e pressione Enter
   - Vá em: **Avançado → Variáveis de Ambiente**
   - Em "Variáveis do sistema", encontre `Path` e clique em **Editar**
   - Clique em **Novo**
   - Adicione: `C:\Program Files\Apache\Maven\bin`
   - Clique em **OK** em tudo

4. **Reinicie o terminal** e execute:
```bash
mvn --version
```

5. **Agora execute o backend:**
```bash
mvn clean spring-boot:run
```

---

## ✅ SOLUÇÃO 2: Usar IntelliJ IDEA (Mais Fácil - 10 minutos)

### Passo a Passo:

1. **Baixe IntelliJ IDEA Community** (GRÁTIS):
   - Acesse: https://www.jetbrains.com/idea/download/
   - Baixe a versão **Community Edition**
   - Instale normalmente

2. **Abra o Projeto:**
   - Abra o IntelliJ IDEA
   - Clique em **Open**
   - Selecione a pasta: `frete-inteligente`
   - Aguarde o IntelliJ importar o projeto (pode demorar)

3. **Execute o Backend:**
   - Encontre o arquivo: `FreteInteligenteApplication.java`
   - Clique com botão direito nele
   - Selecione: **Run 'FreteInteligenteApplication'**
   - Pronto! O backend vai iniciar!

---

## ✅ SOLUÇÃO 3: Usar VS Code com Extension Pack for Java

### Passo a Passo:

1. **Instale a extensão:**
   - No VS Code, vá em Extensions (Ctrl+Shift+X)
   - Procure: **Extension Pack for Java**
   - Instale

2. **Abra o projeto:**
   - Abra a pasta `frete-inteligente` no VS Code

3. **Execute:**
   - Pressione `F5` ou vá em **Run → Start Debugging**
   - Ou clique no ícone de Play ao lado de `main()` em `FreteInteligenteApplication.java`

---

## ✅ SOLUÇÃO 4: Usar Eclipse (Alternativa)

### Passo a Passo:

1. **Baixe Eclipse:**
   - Acesse: https://www.eclipse.org/downloads/
   - Baixe **Eclipse IDE for Enterprise Java and Web Developers**

2. **Importe o Projeto:**
   - File → Import → Maven → Existing Maven Projects
   - Selecione a pasta `frete-inteligente`
   - Finish

3. **Execute:**
   - Botão direito em `FreteInteligenteApplication.java`
   - Run As → Java Application

---

## 🎯 Depois que o Backend Estiver Rodando

### 1. Teste a API:

Execute no terminal:
```powershell
.\TESTAR-API.ps1
```

Ou acesse no navegador:
- http://localhost:8080/api/test/status
- http://localhost:8080/h2-console

### 2. Instale o Node.js para o Frontend:

- Baixe: https://nodejs.org/ (versão LTS)
- Instale normalmente
- Reinicie o terminal

### 3. Execute o Frontend:

```bash
cd transport-app
npm install
npm run dev
```

### 4. Acesse o Sistema:

Abra o navegador em: **http://localhost:3000**

---

## 📞 Qual Solução Escolher?

| Solução | Dificuldade | Tempo | Melhor Para |
|---------|-------------|-------|-------------|
| **IntelliJ IDEA** | ⭐ Fácil | 10 min | Iniciantes |
| **Instalar Maven** | ⭐⭐ Médio | 5 min | Quem quer usar terminal |
| **VS Code + Java** | ⭐⭐ Médio | 10 min | Quem já usa VS Code |
| **Eclipse** | ⭐⭐ Médio | 15 min | Desenvolvedores Java |

---

## 🆘 Ainda com Problemas?

### Verifique:

1. **Java está instalado?**
   ```bash
   java -version
   ```
   Se não, instale: https://adoptium.net/

2. **Porta 8080 está livre?**
   ```powershell
   netstat -ano | findstr :8080
   ```
   Se houver algo rodando, mate o processo ou mude a porta.

3. **Firewall/Antivírus bloqueando?**
   - Adicione exceção para Java

---

## 🎉 Recomendação Final

**Use o IntelliJ IDEA Community!** É gratuito, fácil e resolve todos os problemas de uma vez.

1. Baixe: https://www.jetbrains.com/idea/download/
2. Instale
3. Abra o projeto
4. Clique em Run
5. Pronto!

---

**Depois me avise que solução você escolheu para eu te ajudar nos próximos passos!**

