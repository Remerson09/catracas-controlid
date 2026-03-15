# Sistema de Gestão de Catracas Control iD - TODO

## Fase 1: Arquitetura e Banco de Dados
- [x] Definir schema do banco de dados (dispositivos, usuários, eventos, logs)
- [x] Criar tabelas no Drizzle ORM
- [x] Configurar relacionamentos entre tabelas

## Fase 2: Backend - Integração Control iD
- [x] Implementar módulo de comunicação TCP/IP com catracas
- [x] Criar procedures para envio de comandos hexadecimais
- [x] Implementar monitoramento de status de dispositivos
- [x] Criar procedures tRPC para gerenciamento de dispositivos
- [x] Implementar testes unitários para comunicação de rede

## Fase 3: Frontend - Dashboard e Gerenciamento
- [x] Criar layout do dashboard com sidebar
- [x] Implementar visualização em tempo real de status de catracas
- [x] Criar página de gerenciamento de dispositivos
- [x] Implementar interface de liberação manual de acesso
- [x] Criar formulário de cadastro de novo dispositivo
- [x] Implementar teste de conectividade
- [x] Criar página de gerenciamento de usuários
- [x] Criar página de configurações

## Fase 4: Cadastro Facial, Logs e Auditoria
- [x] Implementar procedures tRPC para logs de eventos
- [x] Implementar procedures tRPC para histórico de comandos
- [x] Criar procedures tRPC para permissões de acesso
- [ ] Implementar integração com API remote_enroll.fcgi (opcional - requer configuração de dispositivos reais)
- [ ] Criar interface de cadastro facial remoto (opcional)

## Fase 5: Testes e Validação
- [x] Testes unitários do módulo de comunicação
- [x] Testes do módulo de autenticação
- [ ] Testes de integração com Control iD (requer dispositivos reais)
- [ ] Testes de interface do usuário

## Fase 6: Entrega
- [x] Documentação do código
- [ ] Checkpoint do projeto
- [ ] Entrega ao usuário
