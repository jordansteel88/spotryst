const BASE_URL = 'http://127.0.0.1:5000';
let searchType = null;
let currentTrackID = null;
let currentTrackPopularity = null;
let currentArtistID = null;
let currentArtistPopularity = null;


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
    $('#results').toggleClass('hidden');
    $('#search-form').toggleClass('hidden');

    if (search_type == "artist") {
        if (res.data.artists.items.length > 0) {
            $('#instructions-display').html('Make a selection to discover related artists');
            // $('#results').append("<h2 class='display-5'>Make a selection to discover related artists:</h2>");
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
            // $('#results').append("<h2 class='display-5'>Select a track to proceed to filter options:</h2>");
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

async function handleArtistChoice(choice) {
    $('#instructions-display').html('Click any of the matches below to view more related artists');
    $('#results').empty();

    currentArtistID = choice;
    console.log(` ID: ${currentArtistID}`);

    const res = await axios.post(`${BASE_URL}/related-artist`, {currentArtistID});
    
    displayRelatedArtists(res);
}

function displayRelatedArtists(res) {
    $('#results').empty();
    for (let i = 0; i < 10; i++){
        if (res.data.artists[i]) {
            let resLink = $(`<button class="d-block m-1 btn btn-outline-light btn-block">${res.data.artists[i].name}</button>`);
            resLink.click(handleArtistChoice.bind(this, `${res.data.artists[i].id}`));
            $('#results').append(resLink);
        }
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
    $('#instructions-display').toggleClass('hidden');
    $('#results').empty();

    if (res.data.tracks) {
        for (let result of res.data.tracks) {
            let resLink = $(`<button class="d-block m-1 btn btn-outline-light btn-block">${result.name} - ${result.artists[0].name}</button>`);
            $('#results').append(resLink);
        }
    } else if (res.data.errors) {
        $('#results').html(`<h2 class="display-5">${res.data.errors.results}</h2>`);
    }
}


