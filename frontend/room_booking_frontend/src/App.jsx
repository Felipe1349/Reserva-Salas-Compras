import React, { useState } from 'react';
import { Building2, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Calendar from './components/Calendar';
import DailyReservations from './components/DailyReservations';
import BookingForm from './components/BookingForm';
import './App.css';

function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleReservationCreated = () => {
    // Forçar atualização dos componentes
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Sistema de Reserva de Salas
              </h1>
              <p className="text-muted-foreground">
                Área de Compras - Gestão de Reuniões
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Consultar Reservas
            </TabsTrigger>
            <TabsTrigger value="booking" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Reserva
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Calendário de Reservas</h2>
                <Calendar 
                  key={`calendar-${refreshKey}`}
                  onDateSelect={handleDateSelect} 
                  selectedDate={selectedDate} 
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Detalhes das Reservas</h2>
                <DailyReservations 
                  key={`daily-${refreshKey}-${selectedDate?.toISOString()}`}
                  selectedDate={selectedDate} 
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="booking">
            <div className="max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-4 text-center">Criar Nova Reserva</h2>
              <BookingForm onReservationCreated={handleReservationCreated} />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-muted-foreground text-sm">
            Sistema de Reserva de Salas - Área de Compras © 2025
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
