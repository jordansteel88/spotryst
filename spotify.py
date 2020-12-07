from flask import session
from models import db, connect_db, TrackResults, ArtistResults
from urllib.parse import urlencode
import base64
import requests
import datetime
# from user import user

class SpotifyAPI(object):
    """Class for Spotify client."""
    # access_token = None
    # access_token_expires = datetime.datetime.utcnow()
    # access_token_did_expire = True
    # refresh_token = None
    client_id = None
    client_secret = None
    token_url = 'https://accounts.spotify.com/api/token'
    # logged_in = False


    def __init__(self, client_id, client_secret, *args, **kwargs): 
        super().__init__(*args, **kwargs)
        self.client_id = client_id
        self.client_secret = client_secret


    def get_client_credentials(self):
        """Return base64 encoded string for token header."""

        client_id = self.client_id
        client_secret = self.client_secret
        print('############# client id ################')
        print(client_id)
        print('############# client secret ################')
        print(client_secret)
        if client_secret == None or client_id == None:
            raise Exception('You must set client_id and client_secret')
        client_creds = f"{client_id}:{client_secret}"
        client_creds_b64 = base64.b64encode(client_creds.encode())

        return client_creds_b64


    def get_token_headers(self):
        """Generate header for token request."""
        client_creds_b64 = self.get_client_credentials()

        return {"Authorization": f"Basic {client_creds_b64.decode()}"}

    
    def get_endpoint_headers(self):
        """Generate header for endpoint requests."""

        # print('######### endpoint access_token ##################')
        # print(session['access_token'])
        # print('######### endpoint access_token ##################')
        
        endpoint_headers = {"Authorization": f"Bearer { session['access_token'] }"}

        return endpoint_headers


    def perform_user_auth(self, user_auth_token):
        """Send token data to Spotify API, return authorization state."""

        data = {
            "grant_type": "authorization_code",
            "code": user_auth_token,
            "redirect_uri": "https://spotryst.herokuapp.com/spotify_callback"
            # "redirect_uri": "http://127.0.0.1:5000/spotify_callback"
        }

        headers = self.get_token_headers()

        res = requests.post(self.token_url, data=data, headers=headers)

        if res.status_code not in range(200, 204):
            raise Exception("Could not authorize user.")

        # self.access_token = res.json()['access_token']
        # self.refresh_token = res.json()['refresh_token']
        # expires_in = res.json()['expires_in']
        # expires = datetime.datetime.utcnow() + datetime.timedelta(seconds=expires_in)
        # self.access_token_expires = expires
        # self.access_token_did_expire = expires < datetime.datetime.utcnow()
        # self.logged_in = True
        # self.get_user_id()

        # session['access_token'] = res.json()['access_token']


        # print('######### user auth access_token ##################')
        # print(session['access_token'])
        # print('######### user auth access_token ##################')

        # session['access_token'] = res.json()['access_token']

        
        return res.json()['access_token']


    def search(self, query, search_type, limit=10):
        """Perform search of Spotify API for track or artist."""
            
        headers = self.get_endpoint_headers()

        endpoint = "https://api.spotify.com/v1/search"

        data = urlencode({"q": query, "type": search_type, "limit": limit})
        lookup_url = f"{endpoint}?{data}"

        res = requests.get(lookup_url, headers=headers)

        # print('############# search res #################')
        # print(res)
        # print('############# search res #################')

        if res.status_code not in range(200, 204):
            return {}
        
        return res.json()

    
    def get_artist(self, artist_id):
        """Return artist object with given id."""
        
        endpoint = f"https://api.spotify.com/v1/artists/{artist_id}"
        headers = self.get_endpoint_headers()
        res = requests.get(endpoint, headers=headers)

        return res.json()
        
        
    def get_related_artists(self, artist_id, limit=10):
        """Return artist object with given id."""
        
        endpoint = f"https://api.spotify.com/v1/artists/{artist_id}/related-artists"
        headers = self.get_endpoint_headers()
        res = requests.get(endpoint, headers=headers)

        return res.json()
        

    def get_track(self, track_id):
        """Return track object with given id."""

        endpoint = f"https://api.spotify.com/v1/tracks/{track_id}"
        headers = self.get_endpoint_headers()
        res = requests.get(endpoint, headers=headers)

        return res.json()


    def get_artists_top_track(self, artist_id):
        """Return top track object with given id"""

        endpoint = f"https://api.spotify.com/v1/artists/{artist_id}/top-tracks"
        headers = self.get_endpoint_headers()
        data = urlencode({"country": "from_token"})
        lookup_url = f"{endpoint}?{data}"

        res = requests.get(lookup_url, headers=headers)

        return res.json()
        
        
    def get_audio_feature_values(self, track_id):
        """Return audio features object with given track id."""

        endpoint = f"https://api.spotify.com/v1/audio-features/{track_id}"
        headers = self.get_endpoint_headers()
        res = requests.get(endpoint, headers=headers)

        return res.json()


    def get_seed_recommendations(self, query_data):
        """Return recommendation object for given track."""

        endpoint = "https://api.spotify.com/v1/recommendations"
        headers = self.get_endpoint_headers()
        data = query_data
        lookup_url = f"{endpoint}?{data}"

        res = requests.get(lookup_url, headers=headers)

        return res.json()


    def build_track_filter_query(self, track_id, track_popularity, energyUI, danceabilityUI, tempoUI, vibeUI, popularityUI, audioFeaturesValues):
        """Build query string based on user filter selections."""

        energy_ref = audioFeaturesValues['energy']
        danceability_ref = audioFeaturesValues['danceability']
        tempo_ref = audioFeaturesValues['tempo']
        vibe_ref = audioFeaturesValues['valence']
        popularity_ref = track_popularity

        if energyUI == "more_energetic":
            energy_delta = "min_energy"
        elif energyUI == "less_energetic":
            energy_delta = "max_energy"
        else:
            energy_delta = "target_energy"        
            
        if danceabilityUI == "more_danceable":
            danceability_delta = "min_danceability"
        elif danceabilityUI == "less_danceable":
            danceability_delta = "max_danceability"
        else:
            danceability_delta = "target_danceability"        
            
        if tempoUI == "faster":
            tempo_delta = "min_tempo"
        elif tempoUI == "slower":
            tempo_delta = "max_tempo"
        else:
            tempo_delta = "target_tempo"        
            
        if vibeUI == "happier_vibes":
            vibe_delta = "min_valence"
        elif vibeUI == "sadder_vibes":
            vibe_delta = "max_valence"
        else:
            vibe_delta = "target_valence"        
        
        if popularityUI == "more_energetic":
            popularity_delta = "min_popularity"
        elif popularityUI == "less_energetic":
            popularity_delta = "max_popularity"
        else:
            popularity_delta = "target_popularity"

        data = urlencode({
            "seed_tracks": track_id,
            "limit": 10,
            energy_delta: energy_ref,
            danceability_delta: danceability_ref,
            tempo_delta: tempo_ref,
            vibe_delta: vibe_ref,
            popularity_delta: popularity_ref
        })

        return data    


    def get_user_id(self):
        """Get user data, return user id"""

        endpoint = "https://api.spotify.com/v1/me"
        headers = self.get_endpoint_headers()

        res = requests.get(endpoint, headers=headers)

        # if not session.get('user_id'):
        #     session['user_id'] = res.json()['id']

        return res.json()['id']


    def get_playlists(self):
        """Get user playlists"""

        endpoint = "https://api.spotify.com/v1/me/playlists"
        headers = self.get_endpoint_headers()
        data = urlencode({"limit": 50})
        lookup_url = f"{endpoint}?{data}"

        res = requests.get(lookup_url, headers=headers)

        return res.json()


    def modify_playlist(self, playlist_id, track_id, modify_type):
        """Add or remove item of given track_id from user playlist of given playlist_id"""

        endpoint = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
        headers = {
            "Authorization": f"Bearer { session['access_token'] }",
            "Content-Type": "application/json"
        }

        data = urlencode({"uris": f"spotify:track:{track_id}"})
        lookup_url = f"{endpoint}?{data}"

        if modify_type == "remove":
            res = requests.delete(lookup_url, headers=headers)
            return res.json()

        if modify_type == "add":
            res = requests.post(lookup_url, headers=headers)
            return res.json()

    
    def follow_artist(self, artist_id):
        """Follow an artist with given ID"""

        endpoint = f"https://api.spotify.com/v1/me/following"

        headers = {
            "Authorization": f"Bearer { session['access_token'] }",
            "Content-Type": "application/json"
        }

        data = urlencode({
            "type": "artist",
            "ids": artist_id
        })

        lookup_url = f"{endpoint}?{data}"

        res = requests.put(lookup_url, headers=headers)

        if res.status_code == 204:
            return True
        else:
            return False

    
    def get_results_history(self, search_type):
        """Retrieve artist dictionary from db."""

        # if not session.get('user_id'):
        #     session['user_id'] = spotify.get_user_id()

        history_dict_list = []

        # print('###### results history user_id ##########')
        # print(session['user_id'])
        # print('###### results history user_id ##########')

        if search_type == "artist":
            history = ArtistResults.query.filter(ArtistResults.user_id == session['user_id']).all()

            for artist in history:
                result = {"id": artist.artist_id, "name": artist.artist_name}
                if result not in history_dict_list:
                    history_dict_list.append(result)

        if search_type == "track":
            history = TrackResults.query.filter(TrackResults.user_id == session['user_id']).all()

            for track in history:
                result = {"id": track.track_id, "name": track.track_name, "artist": track.track_artist, "popularity": track.track_popularity}
                if result not in history_dict_list:
                    history_dict_list.append(result)

        return history_dict_list


    def save_result(self, result_type, result_id, track_popularity):
        """Save search result to db."""

        if result_type == "artist":
            data = self.get_artist(result_id)
            new_result = ArtistResults(
                user_id = session['user_id'],
                artist_id = data['id'],
                artist_name = data['name']
            )

        if result_type == "track":
            data = self.get_track(result_id)
            new_result = TrackResults(
                user_id = session['user_id'],
                track_id = data['id'],
                track_name = data['name'],
                track_artist = data['artists'][0]['name'],
                track_popularity = track_popularity
            )

        db.session.add(new_result)
        db.session.commit()
        
        return new_result



