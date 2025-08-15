from src.models.user import db
from datetime import datetime

class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    room_id = db.Column(db.Integer, db.ForeignKey('room.id'), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    reserved_by = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)

    # Relacionamento com Room
    room = db.relationship('Room', backref=db.backref('reservations', lazy=True))

    def __repr__(self):
        return f'<Reservation {self.room.name} - {self.start_time}>'

    def to_dict(self):
        return {
            'id': self.id,
            'room_id': self.room_id,
            'room_name': self.room.name,
            'start_time': self.start_time.isoformat(),
            'end_time': self.end_time.isoformat(),
            'reserved_by': self.reserved_by,
            'description': self.description
        }

