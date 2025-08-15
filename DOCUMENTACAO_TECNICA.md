# Documentação Técnica - Sistema de Reserva de Salas

## Arquitetura do Sistema

### Stack Tecnológico
- **Backend**: Flask (Python)
- **Frontend**: React (JavaScript)
- **Banco de Dados**: SQLite (integrado)
- **Estilo**: CSS responsivo
- **Deploy**: Manus Platform

### Estrutura do Projeto
```
room_booking_site/
├── backend/
│   └── room_booking_api/
│       ├── src/
│       │   ├── models/
│       │   │   ├── room.py
│       │   │   ├── reservation.py
│       │   │   └── user.py
│       │   ├── routes/
│       │   │   ├── room.py
│       │   │   └── reservation.py
│       │   ├── static/ (frontend build)
│       │   └── main.py
│       ├── requirements.txt
│       └── venv/
└── frontend/
    └── room_booking_frontend/
        ├── src/
        │   ├── components/
        │   │   ├── Calendar.jsx
        │   │   ├── DailyReservations.jsx
        │   │   └── BookingForm.jsx
        │   └── App.jsx
        └── dist/ (build output)
```

## Backend (Flask)

### Modelos de Dados

#### Room (Sala)
```python
- id: Integer (Primary Key)
- name: String (Nome da sala)
- description: String (Descrição)
```

#### Reservation (Reserva)
```python
- id: Integer (Primary Key)
- room_id: Integer (Foreign Key)
- date: Date (Data da reserva)
- start_time: Time (Horário de início)
- end_time: Time (Horário de fim)
- reserved_by: String (Responsável)
- description: String (Descrição)
```

### Endpoints da API

#### Salas
- `GET /api/rooms` - Lista todas as salas
- `GET /api/rooms/<id>` - Detalhes de uma sala específica

#### Reservas
- `GET /api/reservations` - Lista todas as reservas
- `POST /api/reservations` - Cria nova reserva
- `GET /api/reservations/<id>` - Detalhes de uma reserva
- `PUT /api/reservations/<id>` - Atualiza reserva
- `DELETE /api/reservations/<id>` - Remove reserva
- `GET /api/reservations/date/<date>` - Reservas de uma data específica

### Validações Backend
- Verificação de conflitos de horário
- Validação de campos obrigatórios
- Validação de formato de data e hora
- Verificação de existência da sala

## Frontend (React)

### Componentes Principais

#### App.jsx
- Componente principal
- Gerencia estado global
- Controla navegação entre abas

#### Calendar.jsx
- Renderiza calendário mensal
- Marca dias com reservas
- Gerencia seleção de datas
- Integra com API para buscar reservas

#### DailyReservations.jsx
- Exibe reservas de um dia específico
- Formata horários no padrão brasileiro
- Mostra detalhes completos das reservas

#### BookingForm.jsx
- Formulário de criação de reservas
- Validação de campos em tempo real
- Integração com API para criar reservas
- Feedback de sucesso/erro

### Estado da Aplicação
```javascript
{
  activeTab: 'consultar' | 'nova',
  selectedDate: Date,
  reservations: Array,
  rooms: Array,
  loading: Boolean,
  error: String
}
```

## Integração Frontend-Backend

### Comunicação via API REST
- Todas as requisições usam fetch()
- Headers apropriados para JSON
- Tratamento de erros HTTP
- Loading states para UX

### CORS Configuration
- Backend configurado para aceitar requisições do frontend
- Headers CORS apropriados
- Suporte a métodos HTTP necessários

## Deployment

### Processo de Deploy
1. Build do frontend React (`pnpm run build`)
2. Cópia dos arquivos para `/static` do Flask
3. Deploy do Flask com frontend integrado
4. URL pública gerada automaticamente

### URL de Produção
**https://w5hni7cl6wx9.manus.space**

## Funcionalidades Implementadas

### ✅ Requisitos Atendidos
- [x] Sistema de reserva para duas salas (SalaA e SalaB)
- [x] Calendário interativo com dias marcados em vermelho
- [x] Visualização de reservas por dia ao clicar
- [x] Formato brasileiro de data e hora (dd/mm/aaaa, HH:MM)
- [x] Formulário de nova reserva com validações
- [x] Prevenção de conflitos de horário
- [x] Interface responsiva para desktop e mobile
- [x] Design profissional e intuitivo

### Validações Implementadas
- Campos obrigatórios (sala, data, horários, responsável)
- Formato de data válido
- Formato de horário válido (HH:MM)
- Verificação de conflitos de horário na mesma sala
- Validação de horário de fim posterior ao início

## Manutenção e Suporte

### Logs e Monitoramento
- Logs do Flask para debugging
- Console do navegador para erros frontend
- Validações client-side e server-side

### Backup e Dados
- Banco SQLite armazenado localmente
- Dados persistem entre reinicializações
- Salas padrão criadas automaticamente na inicialização

### Atualizações Futuras
- Sistema modular permite fácil extensão
- Novos endpoints podem ser adicionados
- Interface pode ser expandida com novos componentes

---
*Desenvolvido com Flask + React - 2025*

