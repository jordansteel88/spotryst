function displayLogin() {
  $('#info-display-alt').hide();
  $('#instructions-display').hide();
  $('#info-display').hide();
  $('#searchtype-buttons').hide();
  $('#results').hide();
  $('#playlists-buttons').hide();
  $('#nav-directions').hide();
  $('#search-form').hide();
  $('#history-text').hide();
  $('#button-artist-history').hide();
  $('#button-track-history').hide();
  $('#delete-artist-history').hide();
  $('#delete-track-history').hide();
  $('#track-filter-form').hide();
}

function init() {
  $('#instructions-display').html('Make a selection to begin exploring');
 
  $('#login').hide();   
  $('#info-display-alt').hide();  
  $('#info-display').hide();  
  $('#nav-directions').show();     
  $('#instructions-display').show();     
  $('#searchtype-buttons').show();     
  $('#search-form').hide();
  $('#track-filter-form').hide();  
  $('#history-text').hide();
  $('#button-artist-history').hide();
  $('#button-track-history').hide();
  $('#delete-artist-history').hide();
  $('#delete-track-history').hide();  
}

function primeSearchHTML(searchType) {
  $('#info-display-alt').hide();  
  $('#instructions-display').show();  
  $('#nav-directions').hide();   
  $('#search-form').show();
  $('#searchtype-buttons').hide();
  $('#history-instructions').show();

  if (searchType == "artist") {
    $('#instructions-display').html('Enter an artist below');
    $('#search-submit').html('Search Artists');
    $('#history-text').show();
    $('#button-artist-history').show();
  }  
  
  if (searchType == "track") {
    $('#instructions-display').html('Enter a track below');
    $('#search-submit').html('Search Tracks');
    $('#history-text').show();
    $('#button-track-history').show();
  }
}

function primeArtistResultsAndModalHTML() {
    $('#info-display').hide();
    $('#delete-artist-history').hide();
    $('#artist-results').remove();

    $('#results').html(`
        <div id="artist-results" class="row no-gutters"></div>
        <div class="modal fade" id="artistModal" tabindex="-1" role="dialog" aria-labelledby="artistModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content border border-success">
              <div class="modal-header border-bottom border-success mb-3">Click out to return to your matches</div>
              <div id="modal-body" class="modal-body></div>
              <div class="modal-footer"></div>
            </div>
          </div>
        </div> 
    `);
}

function displayArtistFollowUI(res, artistName) {
    $('#info-display').show();

    if (res.data == "True") {
      $('#info-display').html(`Successfully followed ${artistName}!`);
    } else {
      $('#info-display').html(`Something went wrong, try logging back in`);
    }
}

function primeTrackResultsAndModalHTML() {
    $('#track-filter-form').hide();
    $('#instructions-display').html('Click any of the matches below to add the track to one of your playlists');

    $('#results').html(`
        <div id="track-results" class="row no-gutters"></div>
        <div class="modal fade" id="playbackModal" tabindex="-1" role="dialog" aria-labelledby="playbackModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content border border-success">
              <div class="modal-header border-bottom border-success mb-3">Click out to return to your matches</div>
              <div id="modal-body" class="modal-body></div>
              <div class="modal-footer"></div>
            </div>
          </div>
        </div> 
    `);
}

function renderTrackFilterForm() {
    $('#delete-track-history').hide();
    $('#track-filter-form').show();
    $('#instructions-display').html('Select some filters to refine your matches');
    $('#results').empty();
}

function renderPlaylistAddUI(trackName, playlistName, statusCode) {
    $('#info-display').show();

    if (statusCode == 200) {
        $('#info-display').html(`Successfully added "${trackName}" to ${playlistName}!`);
        $('#instructions-display').html("Select another track to save, or click the Spotryst logo to start over");
    } else {
        $('#instructions-display').html("Sorry, we couldn't add your track. Try logging back in."); 
    }

    $('#playlists').hide();
    $('#results').show();
}

function primePlaylistDisplay() {
    $('#results').hide();
    $('#info-display').hide();
    $('#playlists').show();
    $('#playlists').empty();
    $('#instructions-display').html('Choose a playlist to add your selected track');
}

function generateEmbedHTML(trackID) {
  let html = `<iframe src="https://open.spotify.com/embed/track/${trackID}" 
                      width="320" height="400" frameborder="0" allowtransparency="true" 
                      allow="encrypted-media">
              </iframe>`;
  return html;
}

function primeSearchResponseHTML(search_type) {
  $('#results').empty();
  $('#search-form').hide();
  $('#history-text').hide();
  $('#button-track-history').hide();
  $('#button-artist-history').hide();
  $('#results').show();
}  

function primeHistoryHTML(searchType){
  $('#search-form').hide();
  $('#instructions-display').html('No search results yet! <br> Click on the Spotryst logo and perform some searches to populate your search result history');
  $('#history-text').hide();
  $('#results').show();

  if (searchType == "artist") {
    $('#button-artist-history').hide();
    $('#delete-artist-history').show();
  }  
  
  if (searchType == "track") {
    $('#button-track-history').hide();
    $('#delete-track-history').show();
  } 
}

async function clearResults(BASE_URL, resultType) {
  const res = await axios.post(`${BASE_URL}/clear_results`, {resultType});
  $('#info-display-alt').show();
  $('#results').empty();
}

export { displayLogin, init, primeSearchHTML, primeArtistResultsAndModalHTML, displayArtistFollowUI, primeTrackResultsAndModalHTML, primePlaylistDisplay,
         renderTrackFilterForm, renderPlaylistAddUI, generateEmbedHTML, primeSearchResponseHTML, primeHistoryHTML, clearResults }; 