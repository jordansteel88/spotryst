from flask import Flask, redirect, render_template, request
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, User, Results, UserResults
from forms import SearchForm, ArtistFilterForm, TrackFilterForm
from classes import SpotifyAPI, spotify
# import spotify.sync as spotify



app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///spotryst'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = "secret secret, I got a secret."
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
# app.config['SQLALCHEMY_ECHO'] = True

debug = DebugToolbarExtension(app)

# connect_db(app)
# db.create_all()

spotify.perform_auth()


@app.route("/")
def homepage():
    """Display homepage."""

    search_form = SearchForm()
    track_filter_form = TrackFilterForm()
    artist_filter_form = ArtistFilterForm()

    return render_template('index.html', 
                            search_form=search_form,
                            track_filter_form=track_filter_form,
                            artist_filter_form=artist_filter_form)


@app.route("/search", methods=["POST"])
def search():
    """Search Spotify API for track or artist."""

    form = SearchForm()

    if form.validate_on_submit():
        query = request.json['query']
        search_type = request.json['search_type']
        print(query, search_type)

        res = spotify.search(query, search_type, limit=10)
        
        return res

    return {"errors": {"results": "Form validation error"}} 

    
@app.route("/related-artist", methods=["POST"])
def get_related_artists():
    """Get related artists from Spotify API.""" 

    artist_id = request.json['artistID']

    res = spotify.get_related_artists(artist_id)

    return res
    

@app.route("/audio-features", methods=["POST"])
def get_audio_features():
    """Get audio features for given track from Spotify API."""

    track_id = request.json['trackID']

    res = spotify.get_audio_features(track_id)

    return res


