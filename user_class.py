from secrets import client_id, client_secret
import base64
import requests
import datetime
from urllib.parse import urlencode

class APIUser(object):
    """Class for User auth."""
    access_token = None
    access_token_expires: datetime.datetime.utcnow()
    access_token_did_expire: True
    client_id = None
    client_secret = None
    token_url = 'https://accounts.spotify.com/authorize'

    def __init__(self, client_id, client_secret, *args, **kwargs): 
    super().__init__(*args, **kwargs)
    self.client_id = client_id
    self.client_secret = client_secret

    def get_client_credentials(self):
        """Return base64 encoded string for token header."""

        client_id = self.client_id
        client_secret = self.client_secret
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
        
        endpoint_headers = {"Authorization": f"Bearer {self.access_token}"}

        return endpoint_headers


    def get_token_data(self):
        """Generate token request body data."""

        return {"grant_type": "client_credentials"}


    def perform_auth(self):
        """Send token auth data to Spotify API, return authorized state."""

        token_url = self.token_url
        token_data = self.get_token_data()
        token_headers = self.get_token_headers()

        res = requests.post(token_url, data=token_data, headers=token_headers)

        if res.status_code not in range(200, 204):
            raise Exception("Could not authenticate client")
            # return False

        self.access_token = res.json()['access_token']
        expires_in = res.json()['expires_in']
        expires = datetime.datetime.utcnow() + datetime.timedelta(seconds=expires_in)
        self.access_token_expires = expires
        self.access_token_did_expire = expires < datetime.datetime.utcnow()
        return True


    def get_access_token(self):
        """Get access token if it exists, perform auth if it doesn't."""

        if self.access_token_expires < datetime.datetime.utcnow():
            self.perform_auth()
            return self.get_access_token()
        elif self.access_token == None:
            self.perform_auth()
            return self.get_access_token()

        return self.access_token