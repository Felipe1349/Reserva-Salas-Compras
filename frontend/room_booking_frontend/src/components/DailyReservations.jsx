import React, { useState, useEffect } from 'react';
import { Clock, User, MapPin, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import '../App.css';

const DailyReservations = ({ selectedDate }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      fetchDailyReservations();
    }
  }, [selectedDate]);

  const fetchDailyReservations = async () => {
    if (!selectedDate) return;
    
    setLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await fetch(`/api/reservations/daily/${dateStr}`);
      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      } else {
        console.error('Erro ao buscar reservas:', response.statusText);
        setReservations([]);
      }
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoomColor = (roomName) => {
    return roomName === 'SalaA' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  if (!selectedDate) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">Selecione uma data no calendário para ver as reservas</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Reservas para {formatDate(selectedDate)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : reservations.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Nenhuma reserva encontrada para esta data</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <Badge className={getRoomColor(reservation.room_name)}>
                      {reservation.room_name}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{reservation.reserved_by}</span>
                </div>
                
                {reservation.description && (
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm text-muted-foreground">{reservation.description}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyReservations;

