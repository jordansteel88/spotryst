from flask import Flask, redirect, render_template, request, url_for, session, jsonify
import requests
import os
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, TrackResults, ArtistResults
from forms import SearchForm, TrackFilterForm
from spotify import SpotifyAPI
# from secrets import CLIENT_ID, CLIENT_SECRET

# from user import user

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql:///spotryst')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'secret')
app.config['client_id'] = os.environ.get('client_id')
app.config['client_secret'] = os.environ.get('client_secret')
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
# app.config['SQLALCHEMY_ECHO'] = True

debug = DebugToolbarExtension(app)

connect_db(app)
db.create_all()

client_id = app.config['client_id']
client_secret = app.config['client_secret']
spotify = SpotifyAPI(client_id, client_secret)
# spotify = SpotifyAPI(CLIENT_ID, CLIENT_SECRET)

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

    session['access_token'] = spotify.perform_user_auth(user_auth_token)

    # print('######### original access_token ##################')
    # print(session['access_token'])
    # print('######### original access_token ##################')

    return redirect('/')
    

@app.route("/check_login")
def check_login():
    """Check logged in state and return a boolean"""

    # test_query = "a"
    # test_search_type = "artist"

    # res = spotify.search(test_query, test_search_type)

    # if len(res['artists']):

    if session.get('access_token'):
        return {"logged_in": "True"}

    return {"logged_in": "False"}


@app.route("/search", methods=["POST"])
def search():
    """Search Spotify API for track or artist."""

    if not session.get('user_id'):
        session['user_id'] = spotify.get_user_id()

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

    track_id = request.json['currentTrackID']
    track_popularity = request.json['currentTrackPopularity']

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

    return str(res)
    
    
@app.route("/artist_history")
def get_artist_history():
    """Get artist search history for current user"""

    search_type = "artist"
    history = spotify.get_results_history(search_type)

    return jsonify(history)
    
    
@app.route("/track_history")
def get_track_history():
    """Get track search history for current user"""

    search_type = "track"
    history = spotify.get_results_history(search_type)

    return jsonify(history)


@app.route("/save_result", methods=["POST"])
def save_result():
    """Save result based on result_type to db."""

    result_type = request.json['result_type']

    if result_type == "artist":
        result_id = request.json['artistID']
        track_popularity = None
        res = spotify.save_result(result_type, result_id, track_popularity)

    if result_type == "track":
        result_id = request.json['trackID']
        track_popularity = request.json['trackPopularity']
        res = spotify.save_result(result_type, result_id, track_popularity)

    return ('', 200)
        


@app.route("/clear_results", methods=["POST"])
def clear_results():
    """Delete all data from table based on result_type."""

    result_type = request.json['resultType']

    if result_type == "artist":
        all_results = ArtistResults.query.all()
        
    if result_type == "track":
        all_results = TrackResults.query.all()

    for result in all_results:
        db.session.delete(result)

    db.session.commit()

    return ('', 200)







