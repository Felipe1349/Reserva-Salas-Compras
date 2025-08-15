## Endpoints da API (Backend Flask)

### Salas
- `GET /api/rooms`: Retorna uma lista de todas as salas disponíveis.

### Reservas
- `POST /api/reservations`: Cria uma nova reserva.
  - **Request Body:**
    ```json
    {
      "room_id": 1,
      "start_time": "2025-08-23T08:00:00",
      "end_time": "2025-08-23T12:00:00",
      "reserved_by": "Nome do Comprador",
      "description": "Reunião com Fornecedor X"
    }
    ```
  - **Response:**
    - `201 Created`: Reserva criada com sucesso.
    - `409 Conflict`: Conflito de horário (sala já reservada no período).
    - `400 Bad Request`: Dados inválidos.

- `GET /api/reservations/daily/<date>`: Retorna todas as reservas para uma data específica.
  - **Parâmetro de URL:**
    - `<date>`: Data no formato `YYYY-MM-DD` (ex: `2025-08-23`).
  - **Response:**
    ```json
    [
      {
        "id": 1,
        "room_id": 1,
        "room_name": "SalaA",
        "start_time": "2025-08-23T08:00:00",
        "end_time": "2025-08-23T12:00:00",
        "reserved_by": "Nome do Comprador",
        "description": "Reunião com Fornecedor X"
      }
    ]
    ```

- `GET /api/reservations/monthly/<year>/<month>`: Retorna os dias com reservas para um mês e ano específicos.
  - **Parâmetros de URL:**
    - `<year>`: Ano (ex: `2025`).
    - `<month>`: Mês (ex: `08`).
  - **Response:**
    ```json
    [
      "2025-08-23",
      "2025-08-25"
    ]
    ```

