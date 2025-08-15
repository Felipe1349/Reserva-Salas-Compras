from flask import Blueprint, jsonify
from src.models.room import Room

room_bp = Blueprint('room', __name__)

@room_bp.route('/rooms', methods=['GET'])
def get_rooms():
    """Retorna todas as salas disponíveis"""
    rooms = Room.query.all()
    return jsonify([room.to_dict() for room in rooms])

