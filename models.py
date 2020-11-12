"""Models for Spotryst app."""

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class User(db.Model):
    """Model for User."""

    __tablename__ = 'users'

    id = db.Column(db.Integer,
                   primary_key=True,
                   autoincrement=True)
    username = db.Column(db.Text,
                         nullable=False)


    def __repr__(self):
        """Show user's id and username."""

        return f"<Post {self.id} {self.username}>"


class Results(db.Model):
    """Model for Results."""

    __tablename__ = 'results'

    id = db.Column(db.Integer,
                   primary_key=True,
                   autoincrement=True)
    
    related_track = db.Column(db.Text,
                              nullable=False)
    relation_params = db.Column(db.Text,
                                nullable=False)
    timestamp = db.Column(db.DateTime,
                          nullable=False,
                          default=datetime.utcnow())
    
    def __repr__(self):
        """Show result's id, timestamp, and related track."""

        return f"<Post {self.id} {self.timestamp} {self.related_track}>"    



class UserResults(db.Model):
    """Join table for users and results."""

    __tablename__ = 'users_results'

    id = db.Column(db.Integer,
                   primary_key=True,
                   autoincrement=True) 
    user_id = db.Column(db.Integer,
                            db.ForeignKey('users.id'),
                            nullable=False)
    result_id = db.Column(db.Integer,
                            db.ForeignKey('results.id'),
                            nullable=False)


def connect_db(app):
    """Connect to database."""

    db.app = app
    db.init_app(app)