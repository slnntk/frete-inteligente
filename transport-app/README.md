# Frete Inteligente - Transport App

Aplicativo móvel do sistema Frete Inteligente, construído com React Native e Expo.

## 🚀 Tecnologias

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **React Navigation** - Navegação
- **React Native Paper** - Componentes UI (Material Design)
- **React Native Maps** - Mapas e rastreamento
- **Socket.IO Client** - Comunicação em tempo real
- **Axios** - Cliente HTTP
- **AsyncStorage** - Armazenamento local

## 📋 Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Expo CLI instalado globalmente: `npm install -g expo-cli`
- Expo Go app no seu dispositivo móvel (iOS/Android)

## ⚙️ Instalação

1. Entre no diretório do app:
```bash
cd transport-app
```

2. Instale as dependências:
```bash
npm install
```

3. Configure a URL do backend:

Edite o arquivo `src/services/api.js` e atualize a `API_BASE_URL`:

```javascript
// Para desenvolvimento local com dispositivo físico
const API_BASE_URL = 'http://SEU_IP_LOCAL:3000/api';
// Exemplo: http://192.168.1.100:3000/api

// Para emulador Android
// const API_BASE_URL = 'http://10.0.2.2:3000/api';

// Para emulador iOS
// const API_BASE_URL = 'http://localhost:3000/api';
```

> **Importante:** Substitua `SEU_IP_LOCAL` pelo IP local da sua máquina. Para descobrir:
> - Windows: `ipconfig`
> - macOS/Linux: `ifconfig` ou `ip addr`

## 🏃 Executando

### Iniciar o servidor de desenvolvimento:
```bash
npm start
```

### Opções de execução:

- **Expo Go (Recomendado para desenvolvimento):**
  - Escaneie o QR code com o app Expo Go no seu dispositivo
  - Certifique-se de que seu dispositivo está na mesma rede Wi-Fi que seu computador

- **Emulador Android:**
```bash
npm run android
```

- **Simulador iOS (apenas macOS):**
```bash
npm run ios
```

- **Web (para testes rápidos):**
```bash
npm run web
```

## 📱 Funcionalidades

### Para Passageiros:

1. **Cadastro e Login**
   - Criar conta como passageiro, motorista ou empresa
   - Login seguro com email e senha
   - Perfil de usuário

2. **Visualizar Viagens**
   - Lista de viagens disponíveis
   - Filtros por data, origem e destino
   - Informações de preço, horário e vagas disponíveis

3. **Check-in**
   - Fazer check-in em viagens
   - Visualizar histórico de check-ins
   - Cancelar check-ins
   - Status de pagamento

4. **Rastreamento em Tempo Real**
   - Visualizar localização do veículo no mapa
   - Acompanhar rota da viagem
   - Notificações de proximidade (futuro)

### Para Motoristas/Empresas:

1. **Gestão de Viagens**
   - Criar novas viagens
   - Editar viagens existentes
   - Visualizar lista de passageiros

2. **Atualização de Localização**
   - Compartilhar localização em tempo real
   - Atualização automática durante a viagem

## 🎨 Interface

O app utiliza um tema escuro (dark theme) com destaque verde (#4CAF50), conforme especificado no briefing do projeto:

- **Fundo:** #1a1a1a (preto escuro)
- **Cards/Superfícies:** #2a2a2a (cinza escuro)
- **Destaque Principal:** #4CAF50 (verde)
- **Texto:** #ffffff (branco)

## 🔐 Autenticação

O app utiliza JWT (JSON Web Tokens) para autenticação:

1. Após login/registro bem-sucedido, o token é armazenado no AsyncStorage
2. O token é automaticamente incluído em todas as requisições API
3. Se o token expirar, o usuário é redirecionado para a tela de login

## 📡 Integração com Backend

O app se comunica com o backend através de:

### API REST (Axios)
- Autenticação (login/registro)
- CRUD de viagens
- CRUD de check-ins
- Consultas de dados

### WebSocket (Socket.IO)
- Atualizações de localização em tempo real
- Notificações de novos check-ins
- Notificações de cancelamentos

## 🗂️ Estrutura do Projeto

```
transport-app/
├── App.js                    # Componente raiz
├── app.json                  # Configurações do Expo
├── package.json
└── src/
    ├── components/           # Componentes reutilizáveis
    ├── context/             
    │   └── AuthContext.js    # Contexto de autenticação
    ├── navigation/
    │   └── AppNavigator.js   # Configuração de navegação
    ├── screens/
    │   ├── LoginScreen.js
    │   ├── RegisterScreen.js
    │   ├── TripsScreen.js
    │   ├── MyCheckInsScreen.js
    │   └── TripTrackingScreen.js
    ├── services/
    │   └── api.js            # Cliente API e endpoints
    └── utils/                # Funções utilitárias
```

## 🔧 Configurações Importantes

### Permissões (Android)

No arquivo `app.json`, as seguintes permissões são configuradas:
```json
"permissions": [
  "ACCESS_COARSE_LOCATION",
  "ACCESS_FINE_LOCATION"
]
```

### Maps API

Para usar mapas em produção, você precisará configurar:

- **Android:** Google Maps API Key no `app.json`
- **iOS:** Habilitar mapas no Xcode

## 🐛 Troubleshooting

### Erro de conexão com o backend:

1. Verifique se o backend está rodando
2. Confirme que você está usando o IP correto em `api.js`
3. Certifique-se de que o dispositivo está na mesma rede
4. Verifique se o firewall não está bloqueando a porta 3000

### Erro "Unable to resolve module":

```bash
# Limpe o cache do metro bundler
expo start -c
```

### Problemas com dependências:

```bash
# Remova node_modules e reinstale
rm -rf node_modules
npm install
```

## 📦 Build para Produção

### Android APK:
```bash
expo build:android
```

### iOS IPA:
```bash
expo build:ios
```

### App Store / Play Store:

Para publicação nas lojas, você precisará:
1. Conta de desenvolvedor (Apple Developer / Google Play Console)
2. Configurar certificados e provisioning profiles
3. Seguir as diretrizes de cada plataforma

## 🧪 Próximos Passos (MVP Expandido)

- [ ] Notificações push
- [ ] Sistema de pagamento integrado (Pix)
- [ ] Chat entre passageiro e motorista
- [ ] Avaliações e reviews
- [ ] Histórico completo de viagens
- [ ] Otimização de rotas com ML
- [ ] Suporte offline
- [ ] Modo empresa (gestão de frota)

## 📄 Licença

MIT
