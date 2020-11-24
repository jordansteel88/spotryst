const BASE_URL = 'http://127.0.0.1:5000';
let searchType = null;
let currentTrackID = null;
let currentTrackPopularity = null;
let currentArtistID = null;
let currentPlaylistID = null;


/// INITIAL UI LOAD //////////////////////

function init() {
        $('#login').toggleClass('hidden');
        $('#instructions-display').html('Make a selection to begin exploring');
        $('#instructions-display').toggleClass('hidden');
        $('#searchtype-buttons').toggleClass('hidden');
        $('#nav-directions').toggleClass('hidden');
}

init();

/// SEARCH QUERY FUNCTIONS //////////////////////

$('#button-artist').on('click', displayArtistSearch);

function displayArtistSearch() {
    $('#login').toggleClass('hidden');

    $('#instructions-display').html('Enter an artist below');
    $('#search-submit').html('Search Artists');
    $('#searchtype-buttons').toggleClass('hidden');
    $('#search-form').toggleClass('hidden');
    $('#nav-directions').toggleClass('hidden');
    searchType = 'artist';
    console.log(searchType);
}

$('#button-track').on('click', displayTrackSearch);

function displayTrackSearch() {
    $('#login').toggleClass('hidden');

    $('#instructions-display').html('Enter a track below');
    $('#search-submit').html('Search Tracks');
    $('#searchtype-buttons').toggleClass('hidden');
    $('#search-form').toggleClass('hidden');
    $('#nav-directions').toggleClass('hidden');
    searchType = 'track';
    console.log(searchType);
}

async function processSearchForm(evt) {
    evt.preventDefault();

    let query = $('#query').val();
    let search_type = searchType;
    let csrf_token = $('#csrf_token').val();

    const res = await axios.post(`${BASE_URL}/search`, 
                                 {query, search_type, csrf_token});

    handleSearchResponse(res, search_type);
}

$('#search-form').on("submit", processSearchForm);

function handleSearchResponse(res, search_type) {
    $('#results').empty();
    $('#search-form').toggleClass('hidden');

    if ($('#results').hasClass('hidden')){
        $('#results').toggleClass('hidden');
    }

    if (search_type == "artist") {
        if (res.data.artists.items.length > 0) {
            $('#instructions-display').html('Make a selection to discover related artists');
            for (let result of res.data.artists.items) {
                let resLink = $(`<button class="d-block m-1 btn btn-outline-light btn-block">${result.name}</button>`);
                resLink.click(handleArtistChoice.bind(this, `${result.id}`));
                $('#results').append(resLink);
            } 
        }
    } 
    
    else if (search_type == "track" ) { 
        if (res.data.tracks.items.length > 0) {
            $('#instructions-display').html('Make a selection to proceed to track filter options');
            for (let result of res.data.tracks.items) {
                let resLink = $(`<button class="d-block m-1 btn btn-outline-light btn-block">${result.name} - ${result.artists[0].name}</button>`);
                resLink.click(handleTrackChoice.bind(this, `${result.id}`, `${result.popularity}`));
                $('#results').append(resLink);
            }
        }
    } 
    
    else {
        $('#results').html(`
            <h2 class="display-5">No results. Try adjusting your search query.</h2>
        `);
    }
}

// ARTIST FUNCTIONS //////////////////////
// tracks[0].id

async function handleArtistChoice(choice) {
    $('#instructions-display').html('Click any of the matches below to view related artists for that match, or click the "Follow" button to add to your favorite artists');
    // $('#results').empty();

    currentArtistID = choice;
    console.log(` ID: ${currentArtistID}`);

    const res = await axios.post(`${BASE_URL}/related-artist`, {currentArtistID});
    
    displayRelatedArtists(res);
}

function displayRelatedArtists(res) {
    $('#results').html('<div id="artist-results" class="row no-gutters"></div>');

    if ( !($('#info-display').hasClass('hidden')) ) {
        $('#info-display').toggleClass('hidden');
    }

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

    for (let i = 0; i < 10; i++) {
        if (res.data.artists[i]) {
            let resLinkPlayback = $(`
                <div class="col-2">
                  <button type="button" class="mb-1 btn btn-outline-success btn-block"
                          data-toggle="modal" data-target="#artistModal" data-artistid="${res.data.artists[i].id}">
                      Listen
                  </button>
                </div>
            `);

            let resLink = $(`
                <div class="col-8">
                  <button class="mb-1 ml-1 btn btn-outline-light btn-block" type="button">
                    ${res.data.artists[i].name}
                  </button>
                </div>
            `);

            let resLinkFollow = $(`
                <div class="col-2">
                  <button id="follow-${i}" class="mb-1 ml-2 btn btn-outline-success btn-block" type="button">Follow</button>
                </div> 
            `);

            resLink.click(handleArtistChoice.bind(this, `${res.data.artists[i].id}`));
            resLinkFollow.click(handleArtistFollow.bind(this, `${res.data.artists[i].id}`, `${res.data.artists[i].name}`));

            $('#artist-results').append(resLinkPlayback);
            $('#artist-results').append(resLink);
            $('#artist-results').append(resLinkFollow);
        }
    }
}

async function getArtistsTopTrack(artistID) {
    const res = await axios.post(`${BASE_URL}/top-track`, {artistID});

    console.log(res.data);
    return res.data.tracks[0].id;
}

$(document).on('show.bs.modal','#artistModal', displayArtistModal);

async function displayArtistModal(evt) {
    let listenButton = $(evt.relatedTarget);
    let artistID = listenButton.data('artistid');
    console.log(artistID);
    let trackID = await getArtistsTopTrack(artistID);
    console.log(trackID);
    let modal = $(this);
    modal.find('#modal-body').html(`
        <iframe src="https://open.spotify.com/embed/track/${trackID}" 
            width="320" height="400" frameborder="0" allowtransparency="true" 
            allow="encrypted-media">
        </iframe>
    `);
}

$(document).on('hidden.bs.modal','#artistModal', function() {
    $('#modal-body').empty();
});

async function handleArtistFollow(artistID, artistName) {
    const res = await axios.put(`${BASE_URL}/follow`, {artistID});
    console.log(res);
    
    if ($('#info-display').hasClass('hidden')) {
        $('#info-display').toggleClass('hidden');
    }

    if (res.data == "True") {
        $('#info-display').html(`Successfully followed ${artistName}!`);
    } else {
        $('#info-display').html(`Something went wrong, try logging back in`);
    }
}

// TRACK FUNCTIONS //////////////////////

async function handleTrackChoice(choice, pop) {
    renderTrackFilterForm();
    currentTrackID = choice;
    currentTrackPopularity = pop;
    console.log(`currentTrackID: ${currentTrackID} trackPopularity: ${currentTrackPopularity}`);
}

function renderTrackFilterForm() {
    $('#track-filter-form').toggleClass('hidden');
    $('#instructions-display').html('Select some filters to refine your matches');
    $('#results').empty();
}

$('#track-filter-form').on('submit', handleTrackFilterSubmit);

async function handleTrackFilterSubmit(evt) {
    evt.preventDefault();
    res = await mapTrackFilterSelections();
    displayRelatedTracks(res);
}

async function mapTrackFilterSelections() {
    let energy = $('#energy').val();
    let danceability = $('#danceability').val();
    let tempo = $('#tempo').val();
    let vibe = $('#vibe').val();
    let popularity = $('#popularity').val();
    let csrf_token = $('#csrf_token').val();
    let trackID = currentTrackID;
    let trackPopularity = currentTrackPopularity;

    const res = await axios.post(`${BASE_URL}/filter-tracks`,
               {energy, danceability, tempo, vibe, popularity, csrf_token, trackID, trackPopularity});   
    console.log(res.data);

    return res;
}

function displayRelatedTracks(res) {
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

    if (res.data.tracks) {
        for (let track of res.data.tracks) {
            let resLink = $(`
                <div class="col-10">
                    <button class="d-block mb-1 btn btn-outline-light btn-block">
                      ${track.name} - ${track.artists[0].name}
                    </button>
                </div>

            `);

            let resLinkPlayback = $(`
                <div class="col-2">
                    <button type="button" class="mb-1 ml-1 btn btn-outline-success btn-block"
                            data-toggle="modal" data-target="#playbackModal" data-trackid="${track.id}">
                      Listen
                    </button>
                </div>
            `);

            // let resLinkModal = $(`
                // <iframe src="https://open.spotify.com/embed/track/${track.id}" 
                //         width="300" height="380" frameborder="0" allowtransparency="true" 
                //         allow="encrypted-media">
                // </iframe>
            // `)

            resLink.click(displayPlaylists.bind(this, `${track.id}`, `${track.name}`));
            $('#track-results').append(resLink);
            $('#track-results').append(resLinkPlayback);
            
            // $('#modal-body').append(resLinkModal);
        }
    } else if (res.data.errors) {
        $('#results').html(`<h2 class="display-5">${res.data.errors.results}</h2>`);
    }
}

$(document).on('show.bs.modal','#playbackModal', displayPlaybackModal);

function displayPlaybackModal(evt) {
    let listenButton = $(evt.relatedTarget);
    let trackID = listenButton.data('trackid');
    console.log(trackID);
    let modal = $(this);
    modal.find('#modal-body').html(`
        <iframe src="https://open.spotify.com/embed/track/${trackID}" 
                width="320" height="400" frameborder="0" allowtransparency="true" 
                allow="encrypted-media">
        </iframe>
    `);
}

$(document).on('hidden.bs.modal','#playbackModal', function() {
    $('#modal-body').empty();
});

// PLAYLIST FUNCTIONS //////////////////////

async function displayPlaylists(trackID, trackName) {
    console.log(`trackID: ${trackID}`);
    $('#results').toggleClass('hidden');

    if ( !($('#info-display').hasClass('hidden')) ) {
        $('#info-display').toggleClass('hidden');
    }

    $('#instructions-display').html('Choose a playlist to add your selected track');
    $('#playlists').toggleClass('hidden');
    $('#playlists').empty();

    const res = await getPlaylists();

    if (res.data.items.length > 0) {
        for (let playlist of res.data.items) {
            let resLink = $(`<button class="d-block m-1 btn btn-outline-light btn-block">${playlist.name}</button>`);
            resLink.click(handlePlaylistAdd.bind(this, `${playlist.id}`, `${playlist.name}`, `${trackID}`, `${trackName}`));
            $('#playlists').append(resLink);
        }
    } else {
        $('#playlists').html(`<h2 class="display-5">Current user has no playlists</h2>`);
    }
}

async function handlePlaylistAdd(playlistID, playlistName, trackID, trackName) {
    console.log(playlistID, trackID);
    const res = await addToPlaylist(playlistID, trackID);   

    if ($('#info-display').hasClass('hidden')) {
        $('#info-display').toggleClass('hidden');
    }

    if (res == 200) {
        $('#info-display').html(`Successfully added "${trackName}" to ${playlistName}!`);
        $('#instructions-display').html("Select another track to save, or click the Spotryst logo to start over");
    } else {
        $('#instructions-display').html("Sorry, we couldn't add your track. Try logging back in."); 
    }
    $('#playlists').toggleClass('hidden');
    $('#results').toggleClass('hidden');
}

async function getPlaylists() {
    const res = await axios.get(`${BASE_URL}/get_playlists`);

    return res;
}

async function addToPlaylist(playlistID, trackID) {
    const res = await axios.post(`${BASE_URL}/playlist_add`, {playlistID, trackID});
    console.log(res.status);
    return res.status;
}


