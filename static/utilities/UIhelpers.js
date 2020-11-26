function displayLogin() {
  if ( !($('#instructions-display') ).hasClass('hidden')) {
      $('#instructions-display').toggleClass('hidden');
  }    
  
  if ( !($('#searchtype-buttons') ).hasClass('hidden')) {
      $('#searchtype-buttons').toggleClass('hidden');
  }    
}

function init() {
  $('#login').toggleClass('hidden');
  $('#nav-directions').toggleClass('hidden');
  $('#instructions-display').html('Make a selection to begin exploring');
  $('#searchtype-buttons').toggleClass('hidden');
  $('#button-history').toggleClass('hidden');

  if ($('#instructions-display').hasClass('hidden')) {
      $('#instructions-display').toggleClass('hidden');
  }

  if ( !($('#login') ).hasClass('hidden')) {
      $('#login').toggleClass('hidden');
  }  
  
  if ( !($('#delete-artist-history') ).hasClass('hidden')) {
      $('#delete-artist-history').toggleClass('hidden');
  }    
  
  if ( !($('#delete-track-history') ).hasClass('hidden')) {
      $('#delete-track-history').toggleClass('hidden');
  }        
}

function primeSearchHTML(searchType) {
  if ($('#instructions-display').hasClass('hidden')) {
      $('#instructions-display').toggleClass('hidden');}
      
  if ( !($('#info-display-alt') ).hasClass('hidden')) {
      $('#info-display-alt').toggleClass('hidden');}   

  if ($('#search-submit').hasClass('hidden')) {
    $('#search-submit').toggleClass('hidden');
  }

  if (searchType == "artist") {
    $('#instructions-display').html('Enter an artist below');
    $('#search-submit').html('Search Artists');
    $('#history-or').toggleClass('hidden');
    $('#button-artist-history').toggleClass('hidden');
  }  
  
  if (searchType == "track") {
    $('#instructions-display').html('Enter a track below');
    $('#search-submit').html('Search Tracks');
    $('#history-or').toggleClass('hidden');
    $('#button-track-history').toggleClass('hidden');
  }

  $('#searchtype-buttons').toggleClass('hidden');
  $('#search-form').toggleClass('hidden');
  $('#nav-directions').toggleClass('hidden');
  $('#history-instructions').toggleClass('hidden');
}

function primeArtistResultsAndModalHTML() {
    if ( !($('#info-display').hasClass('hidden')) ) {
        $('#info-display').toggleClass('hidden');
    }

    if ( !($('#delete-artist-history') ).hasClass('hidden')) {
      $('#delete-artist-history').toggleClass('hidden');
    } 

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
    if ($('#info-display').hasClass('hidden')) {
      $('#info-display').toggleClass('hidden');
    }

    if (res.data == "True") {
      $('#info-display').html(`Successfully followed ${artistName}!`);
    } else {
      $('#info-display').html(`Something went wrong, try logging back in`);
    }
}

function primeTrackResultsAndModalHTML() {
    $('#track-filter-form').toggleClass('hidden');
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
    if ( !($('#delete-track-history') ).hasClass('hidden')) {
      $('#delete-track-history').toggleClass('hidden');
    }   

    $('#track-filter-form').toggleClass('hidden');
    $('#instructions-display').html('Select some filters to refine your matches');
    $('#results').empty();
}

function renderPlaylistAddUI(trackName, playlistName, statusCode) {
    if ($('#info-display').hasClass('hidden')) {
      $('#info-display').toggleClass('hidden');
    }

    if (statusCode == 200) {
        $('#info-display').html(`Successfully added "${trackName}" to ${playlistName}!`);
        $('#instructions-display').html("Select another track to save, or click the Spotryst logo to start over");
    } else {
        $('#instructions-display').html("Sorry, we couldn't add your track. Try logging back in."); 
    }

    $('#playlists').toggleClass('hidden');
    $('#results').toggleClass('hidden');
}

function primePlaylistDisplay() {
    $('#results').toggleClass('hidden');

    if ( !($('#info-display').hasClass('hidden')) ) {
        $('#info-display').toggleClass('hidden');
    }
    
    $('#instructions-display').html('Choose a playlist to add your selected track');
    $('#playlists').toggleClass('hidden');
    $('#playlists').empty();
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
  $('#search-form').toggleClass('hidden');
  $('#history-or').toggleClass('hidden');
  $('#history-instructions').toggleClass('hidden');

  if (search_type == "artist") {
    $('#button-artist-history').toggleClass('hidden');
  }  
  
  if (search_type == "track") {
    $('#button-track-history').toggleClass('hidden');
  } 

  if ($('#results').hasClass('hidden')){
      $('#results').toggleClass('hidden');
  }
}  

function primeHistoryHTML(searchType){
  $('#search-form').toggleClass('hidden');
  $('#search-submit').toggleClass('hidden');
  $('#instructions-display').html('No search results yet! <br> Click on the Spotryst logo and perform some searches to populate your search result history');
  $('#history-or').toggleClass('hidden');
  $('#history-instructions').toggleClass('hidden');

  if (searchType == "artist") {
    $('#button-artist-history').toggleClass('hidden');
    $('#delete-artist-history').toggleClass('hidden');
  }  
  
  if (searchType == "track") {
    $('#button-track-history').toggleClass('hidden');
    $('#delete-track-history').toggleClass('hidden');
  } 

  if ($('#results').hasClass('hidden')) {
    $('#results').toggleClass('hidden');
  }
}

async function clearResults(BASE_URL, resultType) {
  const res = await axios.post(`${BASE_URL}/clear_results`, {resultType});
  $('#info-display-alt').toggleClass('hidden');
  $('#results').empty();

}

export { displayLogin, init, primeSearchHTML, primeArtistResultsAndModalHTML, displayArtistFollowUI, primeTrackResultsAndModalHTML, primePlaylistDisplay,
         renderTrackFilterForm, renderPlaylistAddUI, generateEmbedHTML, primeSearchResponseHTML, primeHistoryHTML, clearResults }; 