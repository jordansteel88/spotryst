from flask import Flask, redirect, render_template, request, url_for, g
# from flask_cors import CORS, cross_origin
import requests
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, User, Results, UserResults
from forms import SearchForm, TrackFilterForm
from classes import SpotifyAPI, spotify

app = Flask(__name__)

# CORS(app, resources={r"/*": {"origins": "*"}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///spotryst'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = "secret secret, I got a secret."
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
# app.config['SQLALCHEMY_ECHO'] = True

debug = DebugToolbarExtension(app)

# connect_db(app)
# db.create_all()


@app.route("/")
def homepage():
    """Display homepage."""

    search_form = SearchForm()
    track_filter_form = TrackFilterForm()

    return render_template('index.html', 
                            search_form=search_form,
                            track_filter_form=track_filter_form)


@app.route("/spotify_callback")
def spotify_callback():
    """Capture user auth code from Spotify API and redirect to homepage"""

    user_auth_token = request.args['code']    

    spotify.perform_user_auth(user_auth_token)

    #session variables

    return redirect('/')
    

# @app.route("/check_login")
# def check_login():
#     """Check logged in state and return a boolean"""

#     state = spotify.get_access_token()

#     if state:
#         return {"logged_in": "true"}

#     return{"logged_in": "false"}


@app.route("/search", methods=["POST"])
def search():
    """Search Spotify API for track or artist."""

    form = SearchForm()

    if form.validate_on_submit():
        query = request.json['query']
        search_type = request.json['search_type']

        res = spotify.search(query, search_type, limit=10)
        
        return res

    return {"errors": {"results": "Form validation error"}} 

    
@app.route("/related-artist", methods=["POST"])
def get_related_artists():
    """Get related artists from Spotify API.""" 

    artist_id = request.json['currentArtistID']

    res = spotify.get_related_artists(artist_id)

    return res
    
    
@app.route("/top-track", methods=["POST"])
def get_artists_top_track():
    """Get top track for artist with given id.""" 

    artist_id = request.json['artistID']

    res = spotify.get_artists_top_track(artist_id)

    return res
    

@app.route("/audio-features", methods=["POST"])
def get_audio_features():
    """Get audio features for given track from Spotify API."""

    track_id = request.json['trackID']

    res = spotify.get_audio_feature_values(track_id)

    return res


@app.route("/filter-tracks", methods=["POST"])
def filter_tracks():
    """Filter tracks based on user filter selections."""

    track_id = request.json['trackID']
    track_popularity = request.json['trackPopularity']

    audioFeaturesValues = spotify.get_audio_feature_values(track_id)

    form = TrackFilterForm()

    if form.validate_on_submit():
        energyUI = request.json['energy']
        danceabilityUI = request.json['danceability']
        tempoUI = request.json['tempo']
        vibeUI = request.json['vibe']   
        popularityUI = request.json['popularity']   

        query_data = spotify.build_track_filter_query(track_id, track_popularity, energyUI, danceabilityUI, tempoUI, vibeUI, popularityUI, audioFeaturesValues)

        res = spotify.get_seed_recommendations(query_data)

        return res

    return {"errors": {"results": "Form validation error"}} 
    
    
@app.route("/get_playlists")
def get_playlists():
    """Get a list of user playlists."""

    res = spotify.get_playlists()

    return res


@app.route("/playlist_add", methods=["POST"])
def playlist_add():
    """Add track of given id to playlist of given id."""

    playlist_id = request.json['playlistID']
    track_id = request.json['trackID']

    modify_type = "add"

    res = spotify.modify_playlist(playlist_id, track_id, modify_type)

    return res


@app.route("/follow", methods=["PUT"])
def follow_artist():
    """Follow artist of given id"""

    artist_id = request.json['artistID']

    res = spotify.follow_artist(artist_id)

    print('########## follow res###################')
    print(res)
    print('########## follow res###################')    

    return str(res)




