import * as Artist from './utilities/artist.js';
import * as Track from './utilities/tracks.js';
import * as UI from './utilities/UIhelpers.js';  
// const BASE_URL = 'http://127.0.0.1:5000';
const BASE_URL = 'https://spotryst.herokuapp.com/';
let searchType = null;
let currentTrackID = null;
let currentTrackPopularity = null;

/// INITIAL UI LOAD //////////////////////

checkLogin();

async function checkLogin() {
    const res = await axios.get(`${BASE_URL}/check_login`);

    if (res.data.logged_in == "True") {
        UI.init();
    } else {
        UI.displayLogin();
    }
}

/// SEARCH QUERY FUNCTIONS //////////////////////

function displayArtistSearch() {
    searchType = 'artist';
    UI.primeSearchHTML(searchType);
}

$('#button-artist').on('click', displayArtistSearch);


function displayTrackSearch() {
    searchType = 'track';
    UI.primeSearchHTML(searchType);
}

$('#button-track').on('click', displayTrackSearch);

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
    UI.primeSearchResponseHTML(search_type);

    if (search_type == "artist") {
        if (res.data.artists.items.length > 0) {
            let save = true;
            $('#instructions-display').html('Make a selection to discover related artists');
            for (let result of res.data.artists.items) {
                let resLink = $(`<button class="d-block m-1 btn btn-outline-light btn-block">${result.name}</button>`);
                resLink.click(handleArtistChoiceUI.bind(this, `${result.id}`, save));
                $('#results').append(resLink);
            } 
        } else {
            $('#instructions-display').html('Sorry, we couldn\'t find any matches <br> Click on the Spotryst log to start over');
        }
    } 
    
    else if (search_type == "track" ) { 
        if (res.data.tracks.items.length > 0) {
            let save = true;
            $('#instructions-display').html('Make a selection to proceed to track filter options');
            for (let result of res.data.tracks.items) {
                let resLink = $(`<button class="d-block m-1 btn btn-outline-light btn-block">${result.name} - ${result.artists[0].name}</button>`);
                resLink.click(handleTrackChoice.bind(this, `${result.id}`, `${result.popularity}`, save));
                $('#results').append(resLink);
            }
        } else {
            $('#instructions-display').html('Sorry, we couldn\'t find any matches <br> Click on the Spotryst log to start over');
        }
    } 
    
    else {
        $('#instructions-display').html('Oops! <br> There seems to be an issue on the server <br> Click on the Spotryst log to start over');
    }
}

// ARTIST FUNCTIONS //////////////////////

async function handleArtistChoiceUI(artistID, save) {
    $('#instructions-display').html(`<p>Click any of the matches below to view their related artists, <br>
    click the "Listen" button to sample that artist's top track, <br>
    or click the "Follow" button to add to your favorite artists</p>`);

    let result_type = "artist";

    if (save == true) {
        await axios.post(`${BASE_URL}/save_result`, {artistID, result_type});
    }

    displayRelatedArtists(artistID);
}

async function displayRelatedArtists(artistID) {
    UI.primeArtistResultsAndModalHTML();

    let res = await Artist.handleArtistChoice(BASE_URL, artistID);

    for (let i = 0; i < 10; i++) {
        if (res.data.artists[i]) {
            let resLinkPlayback = Artist.generateArtistResLinkPlaybackHTML(res.data.artists[i].id);
            let resLink = Artist.generateArtistResLinkHTML(res.data.artists[i].name, res.data.artists[i].id);
            let resLinkFollow = Artist.generateArtistResLinkFollowHTML(i);

            resLink.click(handleArtistChoiceUI.bind(this, `${res.data.artists[i].id}`));
            resLinkFollow.click(handleArtistFollowUI.bind(this, `${res.data.artists[i].id}`, `${res.data.artists[i].name}`));

            $('#artist-results').append(resLinkPlayback);
            $('#artist-results').append(resLink);
            $('#artist-results').append(resLinkFollow);
        }
    }
}

async function displayArtistModal(evt) {
    let listenButton = $(evt.relatedTarget);
    let artistID = listenButton.data('artistid');
    let trackID = await Artist.getArtistsTopTrack(BASE_URL, artistID);
    let embedHTML = UI.generateEmbedHTML(trackID);
    let modal = $(this);
    modal.find('#modal-body').html(embedHTML);
}

$(document).on('show.bs.modal','#artistModal', displayArtistModal);

$(document).on('hidden.bs.modal','#artistModal', function() {
    $('#modal-body').empty();
});

async function handleArtistFollowUI(artistID, artistName) {
    const res = await Artist.handleArtistFollow(BASE_URL, artistID, artistName);
    UI.displayArtistFollowUI(res, artistName);
}

// TRACK FUNCTIONS //////////////////////

async function handleTrackChoice(trackID, trackPopularity, save) {
    UI.renderTrackFilterForm();
    currentTrackID = trackID;
    currentTrackPopularity = trackPopularity;
    let result_type = "track";

    if (save == true){
        await axios.post(`${BASE_URL}/save_result`, {trackID, trackPopularity, result_type});
    }
}

async function handleTrackFilterSubmit(evt) {
    evt.preventDefault();
    const res = await Track.mapTrackFilterSelections(BASE_URL, currentTrackID, currentTrackPopularity);
    displayRelatedTracks(res);
}

$('#track-filter-form').on('submit', handleTrackFilterSubmit);

function displayRelatedTracks(res) {
    UI.primeTrackResultsAndModalHTML();

    if (res.data.tracks) {
        for (let track of res.data.tracks) {
            let resLink = Track.generateTrackResLinkHTML(track);
            let resLinkPlayback = Track.generateTrackResLinkPlaybackHTML(track);

            resLink.click(displayPlaylists.bind(this, `${track.id}`, `${track.name}`));

            $('#track-results').append(resLink);
            $('#track-results').append(resLinkPlayback);
        }
    } 
}

function displayPlaybackModal(evt) {
    let listenButton = $(evt.relatedTarget);
    let trackID = listenButton.data('trackid');
    let embedHTML = UI.generateEmbedHTML(trackID);
    let modal = $(this);
    modal.find('#modal-body').html(embedHTML);
}

$(document).on('show.bs.modal','#playbackModal', displayPlaybackModal);

$(document).on('hidden.bs.modal','#playbackModal', function() {
    $('#modal-body').empty();
});

// PLAYLIST FUNCTIONS //////////////////////

async function displayPlaylists(trackID, trackName) {
    UI.primePlaylistDisplay();

    const res = await Track.getPlaylists(BASE_URL);

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
    const res = await axios.post(`${BASE_URL}/playlist_add`, {playlistID, trackID});
    let statusCode = res.status;
    UI.renderPlaylistAddUI(trackName, playlistName, statusCode);
}

// RESULTS HISTORY FUNCTIONS //////////////////////

async function displayArtistHistory() {
    searchType = "artist";
    let save = false;
    UI.primeHistoryHTML(searchType);
    const res = await axios.get(`${BASE_URL}/artist_history`);

    if (res.data.length > 0) {
        $('#instructions-display').html('Select one of your previous search results to revisit related artists');

        for (let artist of res.data) {
            let resLink = $(`<button class="d-block m-1 btn btn-outline-light btn-block">${artist.name}</button>`);
            resLink.click(handleArtistChoiceUI.bind(this, `${artist.id}`, save));
            $('#results').append(resLink);
        } 
    } else {
        $('#delete-artist-history').toggleClass('hidden');
    }
}

$('#button-artist-history').on('click', displayArtistHistory);

function clearArtistResults() {
    let resultType = "artist";
    UI.clearResults(BASE_URL, resultType);
    UI.init();
}

$('#delete-artist-history').on('click', clearArtistResults);

async function displayTrackHistory() {
    searchType = "track";
    let save = false;
    UI.primeHistoryHTML(searchType);
    const res = await axios.get(`${BASE_URL}/track_history`);

    if (res.data.length > 0) {
        $('#instructions-display').html('Select one of your previous search results to proceed to track filter options');

        for (let track of res.data) {
            let resLink = $(`<button class="d-block m-1 btn btn-outline-light btn-block">${track.name} - ${track.artist}</button>`);
            resLink.click(handleTrackChoice.bind(this, `${track.id}`, `${track.popularity}`, save));
            $('#results').append(resLink);
        }
    } else {
        $('#delete-track-history').toggleClass('hidden');

    }
}

$('#button-track-history').on('click', displayTrackHistory);

function clearTrackResults() {
    let resultType = "track";
    UI.clearResults(BASE_URL, resultType);
    UI.init();
}

$('#delete-track-history').on('click', clearTrackResults);





