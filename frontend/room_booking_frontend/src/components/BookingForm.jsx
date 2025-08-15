import React, { useState, useEffect } from 'react';
import { CalendarDays, Clock, User, MapPin, FileText, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import '../App.css';

const BookingForm = ({ onReservationCreated }) => {
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    room_id: '',
    date: '',
    start_time: '',
    end_time: '',
    reserved_by: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms');
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      }
    } catch (error) {
      console.error('Erro ao buscar salas:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpar mensagem quando o usuário começar a digitar
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const validateForm = () => {
    const { room_id, date, start_time, end_time, reserved_by } = formData;
    
    if (!room_id || !date || !start_time || !end_time || !reserved_by.trim()) {
      setMessage({ type: 'error', text: 'Todos os campos obrigatórios devem ser preenchidos.' });
      return false;
    }

    if (start_time >= end_time) {
      setMessage({ type: 'error', text: 'A hora de início deve ser anterior à hora de fim.' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { date, start_time, end_time, ...rest } = formData;
      
      // Combinar data e hora para criar datetime ISO
      const startDateTime = new Date(`${date}T${start_time}:00`).toISOString();
      const endDateTime = new Date(`${date}T${end_time}:00`).toISOString();

      const requestData = {
        ...rest,
        room_id: parseInt(formData.room_id),
        start_time: startDateTime,
        end_time: endDateTime
      };

      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Reserva criada com sucesso!' });
        setFormData({
          room_id: '',
          date: '',
          start_time: '',
          end_time: '',
          reserved_by: '',
          description: ''
        });
        if (onReservationCreated) {
          onReservationCreated();
        }
      } else if (response.status === 409) {
        setMessage({ 
          type: 'error', 
          text: 'Conflito de horário: a sala já está reservada neste período.' 
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: data.error || 'Erro ao criar reserva. Tente novamente.' 
        });
      }
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      setMessage({ type: 'error', text: 'Erro de conexão. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Nova Reserva
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {message.text && (
            <Alert className={message.type === 'error' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'}>
              <AlertDescription className={message.type === 'error' ? 'text-red-700' : 'text-green-700'}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="room" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Sala *
            </Label>
            <Select value={formData.room_id} onValueChange={(value) => handleInputChange('room_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma sala" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id.toString()}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Data *
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              min={getTodayDate()}
              onChange={(e) => handleInputChange('date', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Início *
              </Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => handleInputChange('start_time', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Fim *
              </Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => handleInputChange('end_time', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reserved_by" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Reservado por *
            </Label>
            <Input
              id="reserved_by"
              type="text"
              placeholder="Nome do comprador"
              value={formData.reserved_by}
              onChange={(e) => handleInputChange('reserved_by', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Descrição
            </Label>
            <Textarea
              id="description"
              placeholder="Finalidade da reunião (opcional)"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Criando...
              </div>
            ) : (
              'Criar Reserva'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;

