## Esquema do Banco de Dados

### Tabela: `rooms` (Salas)
- `id` (INTEGER, PRIMARY KEY, AUTOINCREMENT): Identificador único da sala.
- `name` (TEXT, NOT NULL): Nome da sala (ex: SalaA, SalaB).

### Tabela: `reservations` (Reservas)
- `id` (INTEGER, PRIMARY KEY, AUTOINCREMENT): Identificador único da reserva.
- `room_id` (INTEGER, NOT NULL): ID da sala reservada (FOREIGN KEY para `rooms.id`).
- `start_time` (DATETIME, NOT NULL): Data e hora de início da reserva.
- `end_time` (DATETIME, NOT NULL): Data e hora de término da reserva.
- `reserved_by` (TEXT, NOT NULL): Nome do comprador que fez a reserva.
- `description` (TEXT): Descrição ou finalidade da reunião.

