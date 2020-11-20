"""Forms for Spotryst app."""

from wtforms import SelectField, StringField, RadioField
from flask_wtf import FlaskForm
from wtforms.validators import InputRequired


class SearchForm(FlaskForm):
    """Form for selecting initial track or artist."""

    # search_type = SelectField("Search Type", 
    #               choices=[("artist", "Artist"), ("track", "Track")],
    #               validators=[InputRequired()])
    query = StringField("Search Query",
                         validators=[InputRequired()])


class TrackFilterForm(FlaskForm):
    """Form for filtering track search parameters."""

    energy = SelectField("Energy", 
                  choices=[("same_energy", "Same Energy"),
                           ("less_energetic", "Less Energetic"), 
                           ("more_energetic", "More Energetic")],
                  validators=[InputRequired()])
    danceability = SelectField("Danceability", 
                  choices=[("same_danceability", "Same Danceability"), 
                           ("less_danceable", "Less Danceable"),
                           ("more_danceable", "More Danceable")],
                  validators=[InputRequired()])
    tempo = SelectField("Tempo", 
                  choices=[("same_tempo", "Same Tempo"), 
                           ("slower", "Slower"),
                           ("faster", "Faster")],
                  validators=[InputRequired()])
    vibe = SelectField("Vibe", 
                  choices=[("same_vibe", "Same Vibe"), 
                           ("sadder_vibes", "Sadder Vibes"),
                           ("happier_vibes", "Happier Vibes")],
                  validators=[InputRequired()])                  
    popularity = SelectField("Popularity", 
                  choices=[("same_popularity", "Same Popularity"),
                           ("less popular", "Less Popular"),
                           ("more_popular", "More Popular")],
                  validators=[InputRequired()])    
    

# class ArtistFilterForm(FlaskForm):
#     """Form for filtering artist search parameters."""

#     popularity = SelectField("Popularity", 
#                   choices=[("same_popularity", "Same Popularity"),
#                            ("less popular", "Less Popular"),
#                            ("more_popular", "More Popular")],
#                   validators=[InputRequired()])