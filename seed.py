"""Seed file for Spotryst db."""

from models import TrackResults, ArtistResults, db
from app import app

db.drop_all()
db.create_all()

# # Users
# a = User(username="testuser1")

# Results
t1 = TrackResults(id=1000,
                  user_id="1226189584",
                  track_id="1BWsQm7kOBjK2aSFYg5HQZ", 
                  track_name="Shofukan",
                  track_artist="Snarky Puppy",
                  track_popularity=50)

t2 = TrackResults(id=1001,
                  user_id="1226189584",             
                  track_id="5lBQ3mnWsYIt5aCdgz1U9n",
                  track_name="Trains",
                  track_artist="Porcupine Tree",
                  track_popularity=56)
                  
t3 = TrackResults(id=1002,
                  user_id="hsiqv7imiho3674ef0kj023kw",             
                  track_id="5lBQ3mnWsYIt5aCdgz1U9n",
                  track_name="Trains",
                  track_artist="Porcupine Tree",
                  track_popularity=56)

a1 = ArtistResults(id=1000,
                   user_id="1226189584",
                   artist_id="3WrFJ7ztbogyGnTHbHJFl2", 
                   artist_name="The Beatles")
                   
a2 = ArtistResults(id=1001,
                   user_id="1226189584",
                   artist_id="36QJpDe2go2KgaRleHCDTp", 
                   artist_name="Led Zeppelin")

a3 = ArtistResults(id=1002,
                   user_id="hsiqv7imiho3674ef0kj023kw",
                   artist_id="36QJpDe2go2KgaRleHCDTp", 
                   artist_name="Led Zeppelin")

# UserResults
# ures1 = UserResults(user_id=1, results_id=1) 
# ures2 = UserResults(user_id=2, results_id=2) 

# add and commit
# db.session.add(a)
# db.session.commit()

# db.session.add_all([t1, t2, t3, a1, a2, a3])
# db.session.commit()

# db.session.add_all([ures1, ures2])
# db.session.commit()
