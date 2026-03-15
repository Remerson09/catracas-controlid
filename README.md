# Sistema de Gestão de Catracas Control iD

Um sistema web completo para gerenciar e monitorar catracas Control iD em tempo real, com dashboard, cadastro de dispositivos, liberação manual de acesso, logs de eventos e auditoria completa.

## Funcionalidades

### Dashboard em Tempo Real
- Visualização instantânea do status de todas as catracas (online/offline/erro)
- Cards com estatísticas de dispositivos conectados
- Atualização automática a cada 30 segundos
- Teste manual de conectividade com cada dispositivo

### Gerenciamento de Dispositivos
- Cadastro de novos dispositivos com IP, porta e localização
- Edição de configurações de dispositivos
- Liberação manual de acesso (unlock) com duração configurável
- Bloqueio de acesso (lock) em tempo real
- Histórico de comandos enviados com status e respostas

### Gerenciamento de Usuários
- Cadastro de usuários com dados pessoais (nome, email, telefone, documento)
- Sistema de permissões por dispositivo
- Controle de acesso (entrada, saída, bidirecional)
- Status de usuários (ativo, inativo, bloqueado)

### Logs e Auditoria
- Registro automático de todos os eventos de acesso
- Histórico detalhado de comandos enviados aos dispositivos
- Rastreamento de quem executou cada ação
- Filtros por dispositivo, usuário e período

### Configurações
- Ajuste de timeout de comunicação
- Configuração de tentativas de reconexão
- Intervalo de verificação de saúde dos dispositivos
- Notificações de eventos

## Arquitetura

### Backend
- **Express.js** com tRPC para APIs type-safe
- **MySQL/TiDB** para persistência de dados
- **Drizzle ORM** para gerenciamento de banco de dados
- Módulo TCP/IP nativo para comunicação com catracas
- Autenticação via Manus OAuth

### Frontend
- **React 19** com Vite
- **Tailwind CSS 4** para estilização
- **shadcn/ui** para componentes
- **TanStack Query** para gerenciamento de estado
- Dashboard responsivo com sidebar navegável

### Banco de Dados
- **Tabela devices**: Dispositivos Control iD cadastrados
- **Tabela accessUsers**: Usuários com acesso ao sistema
- **Tabela accessPermissions**: Permissões de acesso por dispositivo
- **Tabela accessEvents**: Logs de eventos de acesso
- **Tabela commandHistory**: Histórico de comandos enviados
- **Tabela deviceConfigs**: Configurações de cada dispositivo

## Como Usar

### Instalação

```bash
# Instalar dependências
pnpm install

# Configurar banco de dados
pnpm db:push

# Iniciar servidor de desenvolvimento
pnpm dev
```

### Primeiro Uso

1. Acesse o dashboard em `http://localhost:3000`
2. Faça login com sua conta 
3. Vá para a página "Dispositivos" e cadastre sua primeira catraca
4. Insira o IP e porta do dispositivo Control iD
5. Clique em "Testar" para verificar conectividade
6. Use os botões "Abrir" e "Fechar" para controlar a catraca

### Cadastro de Usuários

1. Vá para a página "Usuários"
2. Clique em "Novo Usuário"
3. Preencha os dados pessoais
4. Clique em "Criar Usuário"
5. Na página de usuários, clique em "Gerenciar Permissões" para associar dispositivos

## Estrutura de Pastas

```
controle-catracas-id/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── lib/           # Utilitários e configurações
│   │   └── App.tsx        # Componente raiz
│   └── public/            # Arquivos estáticos
├── server/                # Backend Express + tRPC
│   ├── routers/           # Procedures tRPC
│   ├── controlid.ts       # Módulo de comunicação TCP/IP
│   ├── db.ts              # Helpers de banco de dados
│   └── routers.ts         # Roteador principal
├── drizzle/               # Migrações e schema
│   └── schema.ts          # Definição de tabelas
└── package.json           # Dependências do projeto
```

## API tRPC

### Dispositivos
- `devices.list()` - Lista todos os dispositivos
- `devices.create(data)` - Cria novo dispositivo
- `devices.update(id, data)` - Atualiza dispositivo
- `devices.testConnectivity(id)` - Testa conectividade
- `devices.unlock(deviceId)` - Abre a catraca
- `devices.lock(deviceId)` - Fecha a catraca
- `devices.sendCommand(deviceId, commandType, commandHex)` - Envia comando customizado
- `devices.getCommandHistory(deviceId, limit)` - Obtém histórico de comandos

### Acesso
- `access.listUsers()` - Lista usuários de acesso
- `access.createUser(data)` - Cria novo usuário
- `access.updateUser(id, data)` - Atualiza usuário
- `access.createPermission(data)` - Cria permissão de acesso
- `access.getPermissionsByUser(userId)` - Obtém permissões de um usuário
- `access.getPermissionsByDevice(deviceId)` - Obtém permissões de um dispositivo
- `access.createEvent(data)` - Registra evento de acesso
- `access.getEventsByDevice(deviceId, limit)` - Obtém eventos de um dispositivo
- `access.getEventsByUser(userId, limit)` - Obtém eventos de um usuário
- `access.getEventsByDateRange(startDate, endDate, limit)` - Obtém eventos em período

## Comunicação com Catracas

O sistema se comunica com catracas Control iD via TCP/IP usando comandos hexadecimais. Os comandos padrão incluem:

- **UNLOCK** (A1B2C3D4): Libera acesso - abre a catraca
- **LOCK** (D4C3B2A1): Bloqueia acesso - fecha a catraca
- **STATUS** (00000000): Solicita status do dispositivo
- **RESET** (FFFFFFFF): Reset do dispositivo

Cada comando é registrado no histórico com timestamp, status e resposta do dispositivo.

## Testes

```bash
# Executar testes
pnpm test

# Executar testes em modo watch
pnpm test --watch
```

Os testes cobrem:
- Validação de comandos hexadecimais
- Geração de comandos com duração
- Autenticação e logout

## Configuração de Dispositivos

### Parâmetros Ajustáveis
- **Timeout de Comunicação**: Tempo máximo para aguardar resposta (padrão: 5000ms)
- **Tentativas de Reconexão**: Número de tentativas antes de falhar (padrão: 3)
- **Intervalo de Verificação**: Frequência de verificação de saúde (padrão: 30000ms)
- **Duração do Relé**: Tempo que o relé fica ativado ao abrir (padrão: 1000ms)

## Segurança

- Autenticação obrigatória  OAuth
- Todas as ações são auditadas com identificação do usuário
- Comunicação com dispositivos via TCP/IP seguro
- Validação de comandos hexadecimais
- Controle de acesso baseado em permissões

## Troubleshooting

### Dispositivo offline
1. Verifique se o IP e porta estão corretos
2. Teste a conectividade de rede até o dispositivo
3. Verifique se o dispositivo está ligado
4. Clique em "Testar" para atualizar o status

### Comando não enviado
1. Verifique se o dispositivo está online
2. Aumente o timeout nas configurações
3. Aumente o número de tentativas de reconexão
4. Verifique o histórico de comandos para detalhes do erro

### Problemas de autenticação
1. Faça logout e login novamente
2. Limpe o cache do navegador
3. Verifique se sua conta Manus está ativa

## Suporte

Para dúvidas ou problemas, consulte a documentação da API Control iD em:
https://www.controlid.com.br/docs/access-api-pt/

## Licença

MIT
