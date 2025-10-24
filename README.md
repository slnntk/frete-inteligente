# Frete Inteligente - Sistema Inteligente de Gestão de Fretes

[![Licença: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Versão](https://img.shields.io/badge/Version-1.0-blue.svg)]()
[![Status](https://img.shields.io/badge/Status-Planning-orange.svg)]()

## 🚀 Como Rodar o Projeto

**[▶️ Guia Completo de Como Rodar o Projeto](./COMO-RODAR.md)**

Um guia passo a passo detalhado de como configurar e executar o projeto, incluindo:
- Instruções para rodar com Docker (recomendado)
- Instruções para rodar localmente sem Docker
- Solução de problemas comuns
- Scripts úteis para desenvolvimento

---

## Visão Geral do Projeto

**Frete Inteligente** é um sistema inteligente e abrangente de gestão de fretes e logística, projetado para revolucionar o setor de transporte por meio de tecnologia avançada, aprendizado de máquina e automação de processos. O objetivo principal é otimizar rotas, reduzir custos operacionais, melhorar a eficiência e proporcionar transparência em tempo real para todos os envolvidos na cadeia logística.

### Principais Funcionalidades

🚚 **Otimização Inteligente de Rotas** - Algoritmos baseados em ML para planejamento de rotas otimizadas  
📍 **Rastreamento em Tempo Real da Frota** - Integração de GPS e IoT para monitoramento veicular ao vivo  
📊 **Analytics Preditivo** - Previsão para manutenção, demanda e tempos de entrega  
📦 **Planejamento Automatizado de Cargas** - Otimização 3D de carga para máxima eficiência  
📱 **Acesso Multi-plataforma** - Dashboard web e aplicativos móveis  
🔗 **Integração com Terceiros** - Conexão transparente com ERP e provedores logísticos  

---

## 🏁 Objetivo do MVP

Entregar uma versão inicial do Frete Inteligente que resolva os maiores gargalos da comunicação e organização entre passageiros, motoristas e empresas, com uma plataforma simples, funcional e validada junto aos primeiros usuários.

### 🚀 Funcionalidades Essenciais do MVP

1. **Cadastro e Login**
   - Cadastro de usuário (passageiro, motorista autônomo ou empresa).
   - Campos básicos: nome, CPF, telefone, e-mail, senha.
   - Upload simples de documentos (somente motorista/empresa).
   - Login seguro com e-mail + senha.

2. **Gestão de Passageiros (Check-in de presença)**
   - Passageiro marca no app se vai embarcar ou não em um determinado horário/rota.
   - Check-in com prazo definido (ex.: até 22h do dia anterior).
   - Motorista tem acesso à lista final de passageiros confirmados.
   - Lista exibida em ordem otimizada de embarque.

3. **Pagamentos**
   - Integração inicial com Pix Copia e Cola (gateway mais simples).
   - Tela de pagamentos no app: status de pago/não pago.
   - Histórico básico de pagamentos.
   - Envio automático de comprovante para o motorista.

4. **Calendário de Viagens**
   - Motorista/empresa pode criar rotas fixas com horários pré-definidos.
   - Passageiro consegue visualizar os horários e marcar presença (check-in).
   - Notificações automáticas lembrando do prazo de confirmação.

5. **Localização em Tempo Real**
   - Passageiros podem visualizar no mapa a posição do veículo em tempo real.
   - Motorista compartilha rota automaticamente ao iniciar a viagem.
   - Simples integração com Google Maps API ou Mapbox.

6. **Otimização de Rotas (versão simplificada)**
   - Uso de algoritmo inicial de ordenação de paradas (ex.: menor distância entre os pontos).
   - Motorista visualiza no mapa a rota sugerida pelo sistema.
   - Possibilidade de reordenar manualmente (caso necessário).

### 📱 Fluxo Básico do MVP

1. Passageiro faz cadastro/login.
2. Visualiza calendário de rotas disponíveis.
3. Confirma presença (check-in) até o prazo limite.
4. Motorista acessa lista de passageiros confirmados, com rota otimizada.
5. Motorista inicia viagem → rastreamento em tempo real ativado.
6. Passageiros acompanham no mapa a localização do veículo.
7. Pagamento feito pelo app → status atualizado automaticamente.

---

## Estrutura da Documentação

Este repositório contém documentação abrangente do projeto seguindo o padrão ISO/IEC/IEEE 29148:2018:

### 📋 Documentação de Requisitos
- **[briefing_iso_srs.md](./briefing_iso_srs.md)** - Especificação completa de requisitos de software conforme padrões ISO
- **[srs.md](./srs.md)** - Resumo executivo e guia rápido de referência

### 🏗️ Documentação de Arquitetura  
- **[architecture.md](./architecture.md)** - Arquitetura detalhada do sistema e design técnico

## Escopo do Projeto

O sistema Frete Inteligente aborda desafios críticos da indústria de fretes e logística:

- **Otimização de Custos**: Reduzir custos de transporte em 15-20%
- **Precisão nas Entregas**: Melhorar entregas pontuais para mais de 95%
- **Eficiência Operacional**: Automatizar processos manuais de planejamento
- **Visibilidade em Tempo Real**: Proporcionar transparência total da carga
- **Manutenção Preditiva**: Reduzir tempo de inatividade dos veículos
- **Conformidade Regulatória**: Garantir adesão às normas de transporte

## Usuários-Alvo

- **Gestores de Logística** - Planejamento estratégico e supervisão
- **Despachantes** - Operações diárias e gestão de rotas  
- **Motoristas** - Acesso móvel e atualização de status
- **Clientes** - Rastreamento e notificações de envio
- **Administradores de Sistema** - Configuração e manutenção da plataforma

## Destaques Tecnológicos

- **Arquitetura Cloud-Native** - Microsserviços escaláveis em Kubernetes
- **Machine Learning** - Algoritmos de otimização com TensorFlow
- **Processamento em Tempo Real** - Arquitetura orientada a eventos com Kafka
- **Frontend Moderno** - Web app em React.js e aplicativos móveis em React Native
- **Integração Empresarial** - APIs RESTful e suporte a webhooks
- **Suporte Multilíngue** - Português, Inglês e Espanhol

## Conformidade & Padrões

- ✅ **ISO/IEC/IEEE 29148:2018** - Padrões de engenharia de requisitos
- ✅ **GDPR & LGPD** - Conformidade com privacidade e proteção de dados
- ✅ **ISO 9001:2015** - Processos de gestão da qualidade
- ✅ **ISO/IEC 27001:2013** - Gestão de segurança da informação
- ✅ **Regulamentos de Transporte** - Conformidade com DOT local

## Primeiros Passos

### 🎯 Início Rápido

**[📖 Leia o Guia Completo de Como Rodar o Projeto](./COMO-RODAR.md)** - Instruções detalhadas passo a passo!

### Pré-requisitos Mínimos
- **Java 17+** e **Maven 3.6+** (para o backend)
- **Node.js 18+** e **npm** (para o frontend)
- **Docker** e **Docker Compose** (recomendado para o banco de dados)
- **MySQL 8.0+** (ou use Docker)

### Execução Rápida (com Docker)
```bash
# Clone o repositório
git clone https://github.com/slnntk/frete-inteligente.git
cd frete-inteligente

# Inicie o banco de dados
docker compose up -d mysql

# Execute o backend (em um terminal)
mvn spring-boot:run

# Execute o frontend (em outro terminal)
cd transport-app
npm install --legacy-peer-deps
npm run dev
```

Acesse:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080

Para mais detalhes, consulte o **[Guia Completo](./COMO-RODAR.md)**!

## Status do Projeto

🟡 **Fase Atual**: Análise de Requisitos & Design do Sistema  
📅 **Início**: Agosto de 2025  
👥 **Equipe**: Onboarding da equipe de desenvolvimento  
📈 **Próximo Marco**: Validação da arquitetura técnica  

### Roadmap

- [x] Especificação de requisitos (conformidade ISO)
- [x] Design da arquitetura do sistema
- [ ] Prova de conceito técnica
- [ ] Desenvolvimento do MVP
- [ ] Programa de testes beta
- [ ] Implantação em produção

## Contribuição

Contribuições ao projeto Frete Inteligente são bem-vindas! Leia nossas diretrizes de contribuição e código de conduta.

### Fluxo de Desenvolvimento
1. Revise a [documentação SRS](./briefing_iso_srs.md)
2. Confira o [design da arquitetura](./architecture.md)  
3. Siga os padrões e práticas de codificação
4. Envie pull requests com testes abrangentes

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Suporte

Para dúvidas, problemas ou oportunidades de colaboração:

- 📧 **Email**: [Contato do Projeto]
- 💬 **Issues**: [GitHub Issues](https://github.com/slnntk/frete-inteligente/issues)
- 📖 **Documentação**: Consulte os documentos SRS e de arquitetura
- 🤝 **Colaboração**: Aberto a parcerias e integrações

## Agradecimentos

- Comunidade de padrões ISO/IEC/IEEE pela orientação em engenharia de requisitos
- Projetos open source de logística e transporte pela inspiração
- Comunidade cloud-native e de microsserviços pelos padrões arquiteturais

---

**"Revolucionando a gestão de fretes através da tecnologia inteligente"**

*Este projeto visa transformar a indústria de logística combinando algoritmos avançados, processamento de dados em tempo real e design centrado no usuário para criar a próxima geração de sistemas inteligentes de transporte.*
