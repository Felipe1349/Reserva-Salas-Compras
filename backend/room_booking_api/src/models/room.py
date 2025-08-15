from src.models.user import db

class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    def __repr__(self):
        return f'<Room {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }

