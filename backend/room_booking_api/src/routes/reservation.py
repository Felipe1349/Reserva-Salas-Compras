from flask import Blueprint, request, jsonify
from datetime import datetime, date
from src.models.user import db
from src.models.reservation import Reservation
from src.models.room import Room
from sqlalchemy import and_, or_

reservation_bp = Blueprint('reservation', __name__)

@reservation_bp.route('/reservations', methods=['POST'])
def create_reservation():
    """Cria uma nova reserva"""
    try:
        data = request.get_json()
        
        # Validar dados obrigatórios
        required_fields = ['room_id', 'start_time', 'end_time', 'reserved_by']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Campo obrigatório: {field}'}), 400
        
        # Converter strings de data/hora para objetos datetime
        start_time = datetime.fromisoformat(data['start_time'])
        end_time = datetime.fromisoformat(data['end_time'])
        
        # Validar se a hora de início é anterior à hora de fim
        if start_time >= end_time:
            return jsonify({'error': 'A hora de início deve ser anterior à hora de fim'}), 400
        
        # Verificar se a sala existe
        room = Room.query.get(data['room_id'])
        if not room:
            return jsonify({'error': 'Sala não encontrada'}), 404
        
        # Verificar conflitos de horário
        conflicting_reservations = Reservation.query.filter(
            and_(
                Reservation.room_id == data['room_id'],
                or_(
                    and_(Reservation.start_time <= start_time, Reservation.end_time > start_time),
                    and_(Reservation.start_time < end_time, Reservation.end_time >= end_time),
                    and_(Reservation.start_time >= start_time, Reservation.end_time <= end_time)
                )
            )
        ).first()
        
        if conflicting_reservations:
            return jsonify({
                'error': 'Conflito de horário: a sala já está reservada neste período',
                'conflicting_reservation': conflicting_reservations.to_dict()
            }), 409
        
        # Criar nova reserva
        new_reservation = Reservation(
            room_id=data['room_id'],
            start_time=start_time,
            end_time=end_time,
            reserved_by=data['reserved_by'],
            description=data.get('description', '')
        )
        
        db.session.add(new_reservation)
        db.session.commit()
        
        return jsonify(new_reservation.to_dict()), 201
        
    except ValueError as e:
        return jsonify({'error': 'Formato de data/hora inválido'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reservation_bp.route('/reservations/daily/<date_str>', methods=['GET'])
def get_daily_reservations(date_str):
    """Retorna todas as reservas para uma data específica"""
    try:
        # Converter string de data para objeto date
        target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        
        # Buscar reservas que ocorrem na data especificada
        reservations = Reservation.query.filter(
            and_(
                Reservation.start_time >= datetime.combine(target_date, datetime.min.time()),
                Reservation.start_time < datetime.combine(target_date, datetime.min.time()).replace(day=target_date.day + 1)
            )
        ).order_by(Reservation.start_time).all()
        
        return jsonify([reservation.to_dict() for reservation in reservations])
        
    except ValueError:
        return jsonify({'error': 'Formato de data inválido. Use YYYY-MM-DD'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reservation_bp.route('/reservations/monthly/<int:year>/<int:month>', methods=['GET'])
def get_monthly_reserved_dates(year, month):
    """Retorna os dias com reservas para um mês e ano específicos"""
    try:
        # Criar data de início e fim do mês
        start_date = datetime(year, month, 1)
        if month == 12:
            end_date = datetime(year + 1, 1, 1)
        else:
            end_date = datetime(year, month + 1, 1)
        
        # Buscar reservas no período
        reservations = Reservation.query.filter(
            and_(
                Reservation.start_time >= start_date,
                Reservation.start_time < end_date
            )
        ).all()
        
        # Extrair datas únicas
        reserved_dates = set()
        for reservation in reservations:
            reserved_dates.add(reservation.start_time.date().isoformat())
        
        return jsonify(sorted(list(reserved_dates)))
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

