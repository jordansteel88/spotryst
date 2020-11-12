const BASE_URL = 'http://127.0.0.1:5000';

$('#track-filter-form').hide();
$('#artist-filter-form').hide();

async function processSearchForm(evt) {
    evt.preventDefault();

    let query = $('#query').val();
    let search_type = $('#search_type').val();
    let csrf_token = $('#csrf_token').val();

    const res = await axios.post(`${BASE_URL}/search`, 
                                 {query, search_type, csrf_token});

    handleSearchResponse(res, search_type);
}

$('#search-form').on("submit", processSearchForm);

function handleSearchResponse(res, search_type) {
    $('#search-results').empty();
    $('#search-form').hide();

    if (search_type == "artist") {
        if (res.data.artists.items.length > 0) {
            $('#results').append("<h2 class='display-5'>Make a selection to discover related artists:</h2>");
            for (let result of res.data.artists.items) {
                let resLink = $(`<button class="d-block m-1 btn btn-info btn-block">${result.name}</button>`);
                resLink.click(handleArtistChoice.bind(this, `${result.id}`, `${result.popularity}`));
                $('#results').append(resLink);
            } 
        }
    } 
    
    else if (search_type == "track" ) { 
        if (res.data.tracks.items.length > 0) {
            $('#results').append("<h2 class='display-5'>Select a track to proceed:</h2>");
            for (let result of res.data.tracks.items) {
                let resLink = $(`<button class="d-block m-1 btn btn-info btn-block">${result.name} - ${result.artists[0].name}</button>`);
                resLink.click(handleTrackChoice.bind(this, `${result.id}`));
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

async function handleArtistChoice(choice, pop) {
    // renderArtistFilterForm();

    let artistID = choice;
    let artistPopularity = pop;
    console.log(` ID: ${artistID} popularity: ${pop}`);

    const res = await axios.post(`${BASE_URL}/related-artist`, {artistID});
    
    displayRelatedArtists(res);
}

// function filterArtists(res, pop) {
//     let filteredArtistArray = []
//     for (let result of res.data.artists) {
//         if (result.popularity > pop) {

//         }
//     }
// }

function renderArtistFilterForm() {
    $('#artist-filter-form').show();
    $('#results').empty();
}

function displayRelatedArtists(res) {
    $('#results').empty()
    for (let result of res.data.artists) {
        let resLink = $(`<button class="d-block m-1 btn btn-info btn-block">${result.name}</button>`);
        $('#results').append(resLink);
    }
}


async function handleTrackChoice(choice) {
    renderTrackFilterForm();
    let trackID = choice;
    console.log(` ID: ${trackID}`);
    let audioFeatures = await getAudioFeaturesValues(trackID);
    console.log(audioFeatures);
}

function renderTrackFilterForm() {
    $('#track-filter-form').show();
    $('#results').empty();
}

async function getAudioFeaturesValues(trackID) {
    const res = await axios.post(`${BASE_URL}/audio-features`, {trackID});

    let id = res.data.id
    let energy = res.data.energy;
    let danceability = res.data.danceability;
    let tempo = res.data.tempo;
    let valence = res.data.valence;

    return {
        "id": id,
        "energy": energy,
        "danceability": danceability,
        "tempo": tempo,
        "valence": valence
    };
}

function applyFilters() {
    return;
}

