"""Forms for Spotryst app."""

from wtforms import SelectField, StringField, RadioField
from flask_wtf import FlaskForm
from wtforms.validators import InputRequired


class SearchForm(FlaskForm):
    """Form for selecting initial track or artist."""

    query = StringField("Search Query", 
            validators=[InputRequired(message="Please enter an artist or a track to search")])
    search_type = SelectField("Search Type", 
                  choices=[("artist", "Artist"), ("track", "Track")],
                  validators=[InputRequired(message="Select a type of search")])


class TrackFilterForm(FlaskForm):
    """Form for filtering track search parameters."""

    energy = SelectField("Energy", 
                  choices=[("more_energetic", "More Energetic"), 
                           ("less_energetic", "Less Energetic"),
                           ("same_energy", "Same Energy")],
                  validators=[InputRequired(message="Please make a selection")])
    danceability = SelectField("Danceability", 
                  choices=[("more_danceable", "More Danceable"), 
                           ("less_danceable", "Less Danceable"),
                           ("same_danceability", "Same Danceability")],
                  validators=[InputRequired(message="Please make a selection")])
    tempo = SelectField("Tempo", 
                  choices=[("faster", "Faster"), 
                           ("slower", "Slower"),
                           ("same_tempo", "Same Tempo")],
                  validators=[InputRequired(message="Please make a selection")])
    vibe = SelectField("Vibe", 
                  choices=[("happier_vibes", "Happier Vibes"), 
                           ("sadder_vibes", "Sadder Vibes"),
                           ("same_vibe", "Same Vibe")],
                  validators=[InputRequired(message="Please make a selection")])    
    

class ArtistFilterForm(FlaskForm):
    """Form for filtering artist search parameters."""

    popularity = SelectField("Popularity", 
                  choices=[("more_popular", "More Popular"), 
                           ("less_popular", "Less Popular"),],
                  validators=[InputRequired(message="Please make a selection")])