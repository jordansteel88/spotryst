"""Seed file for Spotryst db."""

from models import User, Results, UserResults, db
from app import app

db.drop_all()
db.create_all()

# Users
a = User(username="testuser1")

# Results
a1 = Results(id=1,
             reference_track_id="1BWsQm7kOBjK2aSFYg5HQZ", 
             reference_track_name="Shofukan",
             reference_track_artist="Snarky Puppy",
             related_track_id="5lBQ3mnWsYIt5aCdgz1U9n",
             related_track_name="Trains",
             related_track_artist="Porcupine Tree",
             relation_params=["same energy", "same danceability", "same tempo", "same vibe", "same popularity"]
)
a2 = Results(id=2,
             reference_track_id="2EqlS6tkEnglzr7tkKAAYD", 
             reference_track_name="Come Together",
             reference_track_artist="The Beatles",
             related_track_id="5HNCy40Ni5BZJFw1TKzRsC",
             related_track_name="Comfortably Numb",
             related_track_artist="Pink Floyd",
             relation_params=["same energy", "same danceability", "same tempo", "same vibe", "same popularity"]
)

# UserResults
ures1 = UserResults(user_id=1, results_id=1) 
ures2 = UserResults(user_id=2, results_id=2) 

# add and commit
db.session.add(a)
db.session.commit()

db.session.add_all([a1, a2])
db.session.commit()

db.session.add_all([ures1, ures2])
db.session.commit()
