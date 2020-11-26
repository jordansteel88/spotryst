"""Models for Spotryst app."""

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class TrackResults(db.Model):
    """Model for TrackResults."""

    __tablename__ = 'track_results'

    id = db.Column(db.Integer,
                   primary_key=True,
                   autoincrement=True)
    user_id = db.Column(db.Text,
                        nullable=False)
    track_id = db.Column(db.Text,
                         nullable=False)
    track_name = db.Column(db.Text,
                           nullable=False)
    track_artist = db.Column(db.Text,
                             nullable=False)
    track_popularity = db.Column(db.Integer,
                                 nullable=False)


    def __repr__(self):
        """Show result's id, track name, and track artist."""

        return f"<Track {self.id} {self.track_name} - {self.track_artist}>" 
                                   

class ArtistResults(db.Model):
    """Model for Results."""

    __tablename__ = 'artist_results'

    id = db.Column(db.Integer,
                   primary_key=True,
                   autoincrement=True)
    user_id = db.Column(db.Text,
                        nullable=False)
    artist_id = db.Column(db.Text,
                          nullable=False)
    artist_name = db.Column(db.Text,
                           nullable=False)
    
    def __repr__(self):
        """Show result's id and artist name."""

        return f"<Artist {self.id} {self.artist_name}>"    




def connect_db(app):
    """Connect to database."""

    db.app = app
    db.init_app(app)