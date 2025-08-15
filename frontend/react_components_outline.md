## Estrutura de Componentes do Frontend React

- **`App.js`**: Componente principal que gerencia o roteamento e o estado global.
- **`Header.js`**: Componente para o cabeçalho do site (título, navegação).
- **`CalendarView.js`**: Componente principal para exibir o calendário de reservas.
  - Responsável por buscar os dias com reservas (`/api/reservations/monthly`).
  - Renderiza o calendário e marca os dias reservados.
  - Gerencia a seleção de datas.
- **`DailyReservations.js`**: Componente para exibir as reservas de um dia específico.
  - Recebe a data selecionada como prop.
  - Busca as reservas para a data selecionada (`/api/reservations/daily/<date>`).
  - Exibe a lista de reservas com detalhes (sala, horário, reservado por, descrição).
- **`BookingForm.js`**: Componente para o formulário de criação de nova reserva.
  - Permite selecionar a sala, data, horário de início e fim.
  - Campos para nome do comprador e descrição.
  - Envia os dados para o backend (`/api/reservations`).
  - Inclui validação de campos e feedback para o usuário (sucesso/erro, conflito).
- **`RoomSelector.js`**: Componente para selecionar a sala disponível.
  - Busca as salas disponíveis (`/api/rooms`).
  - Exibe um dropdown ou lista de seleção de salas.
- **`Footer.js`**: Componente para o rodapé do site.

