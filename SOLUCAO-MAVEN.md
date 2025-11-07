# 🔧 Solução: Erro do Maven Wrapper

## 🔴 Problema: "'powershell' não é reconhecido"

O Maven Wrapper (`mvnw.cmd`) precisa do PowerShell, mas ele não está disponível no seu sistema.

---

## ✅ Soluções (Escolha uma)

### 🎯 Opção 1: Instalar Maven (Recomendado)

#### Via Chocolatey (Mais Fácil):

```bash
# Instalar Chocolatey (se não tiver)
# Acesse: https://chocolatey.org/install

# Instalar Maven
choco install maven
```

#### Manual:

1. **Baixar Maven:**
   - Acesse: https://maven.apache.org/download.cgi
   - Baixe: `apache-maven-3.9.x-bin.zip`

2. **Extrair:**
   - Extraia para: `C:\Program Files\Apache\maven`

3. **Adicionar ao PATH:**
   - Pressione `Win + R`
   - Digite: `sysdm.cpl`
   - Aba "Avançado" → "Variáveis de Ambiente"
   - Em "Variáveis do sistema", edite "Path"
   - Adicione: `C:\Program Files\Apache\maven\bin`
   - Clique em OK

4. **Verificar:**
   ```bash
   mvn --version
   ```

5. **Executar:**
   ```bash
   .\scripts\EXECUTAR-BACKEND-SIMPLES.bat
   ```

---

### 🎯 Opção 2: Usar IntelliJ IDEA (Mais Fácil)

1. **Instalar IntelliJ IDEA Community (Grátis):**
   - https://www.jetbrains.com/idea/download/

2. **Abrir o Projeto:**
   - File → Open → Selecione a pasta do projeto

3. **Aguardar Indexação:**
   - O IntelliJ vai baixar as dependências automaticamente

4. **Executar:**
   - Abra: `src/main/java/frete_inteligente/com/frete_inteligente/FreteInteligenteApplication.java`
   - Clique com botão direito → "Run 'FreteInteligenteApplication'"
   - Ou pressione `Shift + F10`

**Pronto! O backend vai iniciar automaticamente!**

---

### 🎯 Opção 3: Usar Docker (Sem Instalar Nada)

```bash
.\scripts\docker-start.bat
# Escolha opção 1 (Desenvolvimento)
```

O Docker vai:
- ✅ Baixar todas as dependências
- ✅ Compilar o projeto
- ✅ Iniciar o backend automaticamente

**Requisito:** Docker Desktop instalado

---

### 🎯 Opção 4: Habilitar PowerShell

Se você tem Windows 10/11, o PowerShell já vem instalado, mas pode não estar no PATH.

1. **Verificar se existe:**
   ```bash
   where powershell
   ```

2. **Se não encontrar, habilitar:**
   - Pressione `Win + X`
   - Selecione "Windows PowerShell (Admin)"
   - Execute: `Enable-WindowsOptionalFeature -Online -FeatureName MicrosoftWindowsPowerShellV2Root`

3. **Ou adicionar ao PATH:**
   - Normalmente está em: `C:\Windows\System32\WindowsPowerShell\v1.0\`

---

## 🚀 Solução Rápida (Teste Primeiro)

### 1. Verificar se Maven está instalado:

```bash
mvn --version
```

**Se aparecer a versão do Maven, use:**

```bash
.\scripts\EXECUTAR-BACKEND-SIMPLES.bat
```

### 2. Se não tiver Maven, use IntelliJ IDEA:

1. Baixe: https://www.jetbrains.com/idea/download/
2. Abra o projeto
3. Execute `FreteInteligenteApplication.java`

---

## 📋 Checklist

- [ ] Java instalado? (`java -version`)
- [ ] Maven instalado? (`mvn --version`)
- [ ] IntelliJ IDEA instalado? (alternativa)
- [ ] Docker instalado? (alternativa)

---

## 🆘 Ainda com Problemas?

### Verificar Java:

```bash
java -version
```

**Deve mostrar Java 17+ ou 21+**

Se não tiver, instale:
- https://adoptium.net/temurin/releases/
- Escolha: Windows x64, JDK 21

### Verificar Porta 8080:

```bash
netstat -ano | findstr :8080
```

Se estiver ocupada, mate o processo:
```bash
taskkill /PID <numero> /F
```

---

## 💡 Recomendação

**Para desenvolvimento, use IntelliJ IDEA:**
- ✅ Não precisa configurar nada
- ✅ Baixa dependências automaticamente
- ✅ Debug integrado
- ✅ Interface visual
- ✅ Grátis (Community Edition)

**Para produção, use Docker:**
- ✅ Ambiente isolado
- ✅ Fácil de configurar
- ✅ Não precisa instalar nada no sistema

---

## 🎯 Próximos Passos

1. Escolha uma das opções acima
2. Execute o backend
3. Aguarde: `Started FreteInteligenteApplication`
4. Teste: http://localhost:8080/api/test/status
5. Execute o frontend: `.\scripts\INICIAR-FRONTEND.bat`

**Pronto! Agora deve funcionar! 🎉**

