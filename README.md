# Spotryst
Spotryst is a Spotify concierge powered by the Spotify API. It provides an intuitive user interface for searching and filtering related songs and artists, sampling your search results, and adding those results to your playlists and follows. You can try out Spotryst at https://spotryst.herokuapp.com 

### Getting Started
Upon navigating to https://spotryst.herokuapp.com, click the ***Login*** button and Spotify will prompt you for your credentials. Spotryst requires permission to modify your playlists and follows, as well as permission to read your user details so that it can provide playback functionality.

### Design Choices
I wanted to build an app utilizing the Spotify API because of its dev-friendly features, its robust data set, and Spotify's expansive developer community. I was particularly interested in utilizing the audio analysis objects to allow for a filtered track search, and the API provides a very convenient endpoint for seeding related track/artist searches with a number of filter parameters. Along with easily implementable embedding to allow for a more immersive interaction with native Spotify functionality, coding the user flow was mostly a breeze.

##### DEVELOPER NOTE: This app requires a Client ID and Client Secret plugged into Python files to function, and these are **NOT** included in this repository. You can get these from [Spotify](https://developer.spotify.com/). 

### User Flow
Once you're logged in, you can choose to start with an artist search or a track search:

##### Artist Search
Choosing ***Start with an artist*** will prompt you to enter a search term, which will then give you a list of results to choose from. You also have the option here to ***View Results History***, which will start out empty but populate as you make selections from your search results. 

Once a selection is made, Spotryst will show a list of 10 artists related to your selection. Here you have 3 options:
1. Click the ***Listen*** button next to an artist to here full playback of that artist's top track
2. Click the ***Follow*** button next to an artist to add that selection to your followed artists on Spotify
3. Click the button containing the artist's name to get a new list of 10 artists related to _that_ artist

At any point, clicking the Spotryst logo at the top of the screen will bring allow you start over and choose between the two search types.

##### Track Search
Chosing ***Start with a track*** will begin with the same user flow as an artist search, but once you make your selection you will be directed to a list of 5 filter options. Your selections (which default to **same**) will filter your end results using audio analysis data proved by the Spotify API. The 5 filter options are based on:
1. Energy - defined by intensity and activity (eg. dubstep energy > folk rock energy)
2. Danceability - defined by rhythmic stability and beat strength (eg. disco danceability > math rock danceability)
3. Tempo - defined by average beats per minute (eg. techno tempo > bossa nova tempo)
4. Vibe - defined by valence metric, a quantization of overall "positiveness" (eg. Christian rock vibe (happier) > death metal vibe (sadder))
5. Popularity - defined by number and recency of Spotify plays (eg. "Shape of You" by Ed Sheeran > "Mambo No. 5" by Lou Bega)

Once a selection is made, Spotryst will show a list of 10 related tracks that fit your filter parameters. Here you have 2 options:
1. Click the ***Listen*** button next to an artist to here full playback of that track
2. Click the button containing the track's name to add that song to one of your playlists

Option #2 will show a list of your playlists, and selecting one will add that song to that playlist. Once you're done with that set of matches, click the Spotryst logo to start over.

##### Results History
Under the search form for both tracks and artists, you'll see an option to ***View Results History***. Selecting this will show you a list of every item you've selected from your initial queries, stored in the Spotryst database. Selecting an item in this table will bring you to either a list of related artists (for artist results history) or filtering options (for track results history). From that point on, the user flow is the same as described above. You'll also have the options on the screen to ***Clear Results***, which will remove all tracks or all artists from record.

### Technologies
- Python/Flask on the back end
- Javascript/jQuery/Bootstrap on the front end
- WTForms for form layout and validation
- PostgreSQL/SQLAlchemy for data management
- Axios for streamlining API calls


