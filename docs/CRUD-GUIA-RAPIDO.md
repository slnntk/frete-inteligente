# 🚀 Guia Rápido - CRUD de Usuários

Guia prático para usar o sistema de gerenciamento de Clientes, Autônomos e Empresas.

---

## ⚡ Início Rápido (5 minutos)

### 1️⃣ **Iniciar o Sistema**

**Opção A - Docker (Recomendado):**
```bash
.\scripts\docker-start.bat
# Escolha opção 1 (Desenvolvimento)
```

**Opção B - Local:**
```bash
# Terminal 1 - Backend
mvnw.cmd spring-boot:run

# Terminal 2 - Frontend
cd transport-app
npm run dev
```

### 2️⃣ **Acessar a Interface**

Abra o navegador em: **http://localhost:3000/usuarios**

Ou navegue: **http://localhost:3000/navegacao** → "Gerenciar Usuários (CRUD)"

---

## 📝 Criar Usuários

### Cliente (Estudante)

1. Clique em **"+ Novo Usuário"**
2. Selecione **"Cliente / Estudante"**
3. Preencha:
   - Nome: João Silva
   - E-mail: joao@email.com
   - CPF: 123.456.789-00
   - Telefone: (85) 99999-9999
   - Matrícula: 2024001
   - Instituição: UFC
   - Curso: Engenharia
   - Senha: senha123
4. Clique em **"Cadastrar"**

### Motorista Autônomo

1. Clique em **"+ Novo Usuário"**
2. Selecione **"Motorista Autônomo"**
3. Preencha:
   - Nome: Carlos Motorista
   - E-mail: carlos@email.com
   - CPF: 987.654.321-00
   - Telefone: (85) 98888-8888
   - CNH: 12345678901
   - Categoria CNH: D
   - ✓ EAR (se aplicável)
   - Senha: senha123
4. Clique em **"Cadastrar"**

### Empresa de Transporte

1. Clique em **"+ Novo Usuário"**
2. Selecione **"Empresa de Transporte"**
3. Preencha:
   - Nome Fantasia: Transportes XYZ
   - E-mail: contato@xyz.com
   - Telefone: (85) 3000-0000
   - CNPJ: 12.345.678/0001-00
   - Razão Social: Transportes XYZ LTDA
   - Senha: senha123
4. Clique em **"Cadastrar"**

---

## 🔍 Filtrar Usuários

No dropdown de filtros, selecione:
- **Todos** - Mostra todos os tipos
- **Clientes** - Apenas estudantes
- **Autônomos** - Apenas motoristas
- **Empresas** - Apenas empresas

---

## ✏️ Editar Usuário

1. Clique no botão **✏️ (Editar)** na linha do usuário
2. Modifique os campos desejados
3. Clique em **"Atualizar"**

> **Dica:** Deixe a senha em branco se não quiser alterá-la

---

## 🗑️ Excluir Usuário

1. Clique no botão **🗑️ (Excluir vermelho)** na linha do usuário
2. Confirme a exclusão no dialog
3. O usuário será removido permanentemente

> **⚠️ Atenção:** Esta ação não pode ser desfeita!

---

## 📊 Dashboard

Visualize em tempo real:
- **Total** de usuários cadastrados
- Quantidade de **Clientes** 🎓
- Quantidade de **Autônomos** 🚗
- Quantidade de **Empresas** 🏢

---

## 🧪 Testar via Script

Execute o teste automatizado:

```powershell
.\scripts\TESTAR-CRUD.ps1
```

Este script testa automaticamente:
- ✅ Criar Cliente
- ✅ Listar Clientes
- ✅ Buscar Cliente por ID
- ✅ Atualizar Cliente
- ✅ Deletar Cliente
- ✅ Criar Autônomo
- ✅ Listar Autônomos
- ✅ Atualizar Autônomo
- ✅ Deletar Autônomo
- ✅ Criar Empresa
- ✅ Listar Empresas
- ✅ Atualizar Empresa
- ✅ Deletar Empresa

---

## 🎯 Endpoints da API

### Cliente
- `GET /api/clientes` - Listar todos
- `GET /api/clientes/{id}` - Buscar por ID
- `POST /api/clientes` - Criar novo
- `PUT /api/clientes/{id}` - Atualizar
- `DELETE /api/clientes/{id}` - Excluir

### Autônomo
- `GET /api/autonomos` - Listar todos
- `GET /api/autonomos/{id}` - Buscar por ID
- `POST /api/autonomos` - Criar novo
- `PUT /api/autonomos/{id}` - Atualizar
- `DELETE /api/autonomos/{id}` - Excluir

### Empresa
- `GET /api/empresas` - Listar todos
- `GET /api/empresas/{id}` - Buscar por ID
- `POST /api/empresas` - Criar novo
- `PUT /api/empresas/{id}` - Atualizar
- `DELETE /api/empresas/{id}` - Excluir

---

## 💡 Dicas

### Formulário Dinâmico
- O formulário muda automaticamente conforme o tipo selecionado
- Cada tipo tem campos específicos para suas necessidades
- Validação em tempo real garante dados corretos

### Badges de Tipo
- 🎓 **Azul** = Cliente
- 🚗 **Verde** = Autônomo
- 🏢 **Roxo** = Empresa

### Feedback Visual
- ✅ **Toast Verde** = Operação bem-sucedida
- ❌ **Toast Vermelho** = Erro na operação
- ⏳ **Loading** = Processando

---

## ❓ Solução de Problemas

### Erro ao criar usuário
- Verifique se o backend está rodando
- Confira se todos os campos obrigatórios estão preenchidos
- E-mails devem ser únicos

### Tabela não carrega
- Verifique conexão com o backend (http://localhost:8080)
- Abra o console do navegador (F12) para ver erros
- Recarregue a página (F5)

### Edição não salva
- Verifique se modificou algum campo
- Senha pode ficar em branco (mantém a anterior)
- Aguarde o toast de confirmação

---

## 📚 Documentação Completa

Para mais detalhes, consulte:
- [`CRUD-USUARIOS.md`](./CRUD-USUARIOS.md) - Documentação técnica completa
- [`EXEMPLOS-JSON.md`](./EXEMPLOS-JSON.md) - Exemplos de requisições

---

## 🎉 Pronto!

Agora você já sabe como:
- ✅ Criar usuários dos 3 tipos
- ✅ Listar e filtrar usuários
- ✅ Editar informações
- ✅ Excluir usuários
- ✅ Usar o dashboard
- ✅ Testar via script

**Aproveite o sistema!** 🚀

