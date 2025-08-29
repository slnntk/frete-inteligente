# Frete Inteligente - MVP (Minimum Viable Product)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-MVP-green.svg)]()
[![Status](https://img.shields.io/badge/Status-Planning-orange.svg)]()

## MVP Overview

O **Frete Inteligente MVP** é uma versão simplificada do sistema de gestão de frete inteligente, focada nas funcionalidades essenciais para validação do conceito e primeiras operações.

### Funcionalidades Core do MVP

🚚 **Gestão Básica de Rotas** - Planejamento de rotas simples com otimização básica  
📍 **Rastreamento de Frota** - Monitoramento GPS em tempo real  
📦 **Planejamento de Cargas** - Otimização básica de carregamento  
📱 **Aplicativo Mobile Básico** - App React Native para motoristas  
🖥️ **Dashboard Web** - Interface web para gestores  

## Stack Tecnológica - MVP

### Backend
- **Linguagem**: Java 17+
- **Framework**: Spring Boot 3.x
- **APIs**: Spring Web (RESTful APIs)
- **Banco de Dados**: PostgreSQL 14+
- **Cache**: Redis 6+

### Frontend Web
- **Framework**: React.js com TypeScript
- **UI Components**: Material-UI
- **Estado**: Context API / Redux Toolkit

### Mobile
- **Framework**: React Native 0.72+
- **Navegação**: React Navigation v6
- **Estado**: Redux Toolkit
- **Plataformas**: iOS 14+ e Android 10+

### Infraestrutura MVP
- **Container**: Docker
- **Proxy**: NGINX
- **Deploy**: Docker Compose / Kubernetes simples

## Arquitetura Simplificada

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   App Mobile    │    │   Dashboard Web  │    │   APIs REST     │
│ (React Native)  │───▶│    (React.js)    │───▶│ (Spring Boot)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │   PostgreSQL    │
                                                │   + Redis       │
                                                └─────────────────┘
```

## Escopo do MVP

### Funcionalidades Incluídas ✅

1. **Gestão de Veículos**
   - Cadastro básico de veículos
   - Status atual (disponível/em rota)
   - Localização GPS

2. **Planejamento de Rotas**
   - Criação manual de rotas
   - Otimização básica (menor distância)
   - Visualização no mapa

3. **Acompanhamento de Entregas**
   - Status básico das entregas
   - Notificações simples
   - Timeline de eventos

4. **Interface Mobile (Motorista)**
   - Login simples
   - Visualização de rotas atribuídas
   - Atualização de status de entrega
   - GPS tracking

5. **Dashboard Web (Gestor)**
   - Visão geral da frota
   - Monitoramento de rotas ativas
   - Relatórios básicos

### Funcionalidades Excluídas (Projeto Completo) ❌

- Machine Learning avançado
- Integração com ERP/WMS
- Analytics preditivos
- Otimização complexa de cargas
- Múltiplos tenants
- Automações avançadas
- Integrações com terceiros

## Requisitos Técnicos MVP

### Performance
- Suporte para até 100 veículos simultâneos
- Resposta < 5 segundos para operações críticas
- 99% de disponibilidade

### Segurança
- Autenticação JWT
- HTTPS obrigatório
- Validação básica de inputs

### Compatibilidade
- **Web**: Chrome 90+, Firefox 88+, Safari 14+
- **Mobile**: iOS 14+, Android 10+

## Roadmap MVP

### Fase 1 - Core Backend (4 semanas)
- [x] Setup do projeto Spring Boot
- [ ] APIs básicas (veículos, rotas, usuários)
- [ ] Autenticação JWT
- [ ] Banco de dados PostgreSQL

### Fase 2 - Frontend Web (3 semanas)
- [ ] Dashboard React.js
- [ ] Autenticação frontend
- [ ] Gestão de veículos
- [ ] Visualização de rotas

### Fase 3 - Mobile App (4 semanas)
- [ ] App React Native
- [ ] Login/navegação
- [ ] GPS tracking
- [ ] Interface do motorista

### Fase 4 - Integração e Testes (2 semanas)
- [ ] Integração completa
- [ ] Testes de usuário
- [ ] Deploy de produção

## Métricas de Sucesso MVP

- ✅ **Funcionalidade**: Sistema completo funcionando
- ✅ **Performance**: < 5s tempo de resposta
- ✅ **Usabilidade**: Interface intuitiva para usuários básicos
- ✅ **Estabilidade**: 99% uptime durante testes
- ✅ **Validação**: Feedback positivo de 3+ empresas teste

## Próximos Passos

1. ✅ Documentação MVP completa
2. [ ] Aprovação do escopo MVP
3. [ ] Setup do ambiente de desenvolvimento
4. [ ] Início do desenvolvimento Spring Boot
5. [ ] Definição da equipe de desenvolvimento

---

**Documentação Relacionada:**
- [Arquitetura MVP](./architecture-mvp.md)
- [Especificações Técnicas MVP](./technical-specs-mvp.md)
- [Projeto Completo](../projeto-completo/README.md)