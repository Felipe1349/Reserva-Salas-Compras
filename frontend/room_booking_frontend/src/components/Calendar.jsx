import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import '../App.css';

const Calendar = ({ onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reservedDates, setReservedDates] = useState([]);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  useEffect(() => {
    fetchReservedDates();
  }, [currentDate]);

  const fetchReservedDates = async () => {
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const response = await fetch(`/api/reservations/monthly/${year}/${month}`);
      if (response.ok) {
        const dates = await response.json();
        setReservedDates(dates);
      }
    } catch (error) {
      console.error('Erro ao buscar datas reservadas:', error);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Adicionar dias vazios do início do mês
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Adicionar todos os dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const formatDateForComparison = (date) => {
    return date.toISOString().split('T')[0];
  };

  const isDateReserved = (date) => {
    if (!date) return false;
    const dateStr = formatDateForComparison(date);
    return reservedDates.includes(dateStr);
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const handleDateClick = (date) => {
    if (date && onDateSelect) {
      onDateSelect(date);
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const days = getDaysInMonth(currentDate);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigateMonth(-1)}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <CardTitle className="text-lg font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </CardTitle>
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigateMonth(1)}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              disabled={!date}
              className={`
                h-10 w-10 text-sm rounded-md transition-colors
                ${!date ? 'invisible' : ''}
                ${isToday(date) ? 'bg-primary text-primary-foreground font-semibold' : ''}
                ${isSelected(date) ? 'bg-accent text-accent-foreground ring-2 ring-primary' : ''}
                ${isDateReserved(date) && !isSelected(date) && !isToday(date) 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : !isToday(date) && !isSelected(date) 
                    ? 'hover:bg-accent hover:text-accent-foreground' 
                    : ''
                }
                ${date && !isToday(date) && !isSelected(date) && !isDateReserved(date) 
                  ? 'text-foreground' 
                  : ''
                }
              `}
            >
              {date ? date.getDate() : ''}
            </button>
          ))}
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Dias com reservas</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Calendar;

