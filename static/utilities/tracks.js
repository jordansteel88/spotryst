async function mapTrackFilterSelections(BASE_URL, currentTrackID, currentTrackPopularity) {
    let energy = $('#energy').val();
    let danceability = $('#danceability').val();
    let tempo = $('#tempo').val();
    let vibe = $('#vibe').val();
    let popularity = $('#popularity').val();
    let csrf_token = $('#csrf_token').val();

    const res = await axios.post(`${BASE_URL}/filter-tracks`,
               {energy, danceability, tempo, vibe, popularity, csrf_token, currentTrackID, currentTrackPopularity});   

    return res;
}

function generateTrackResLinkHTML(track) {
    let html = $(`<div class="col-10" id="${track.id}">
              <button class="d-block mb-1 btn btn-outline-light btn-block">
                ${track.name} - ${track.artists[0].name}
              </button>
           </div>`);
    return html;
}

function generateTrackResLinkPlaybackHTML (track) {
    let html = $(`<div class="col-2">
                  <button type="button" class="mb-1 ml-1 btn btn-outline-success btn-block"
                          data-toggle="modal" data-target="#playbackModal" data-trackid="${track.id}">
                    Listen
                  </button>
                </div>`);
    return html;
}

async function getPlaylists(BASE_URL) {
    const res = await axios.get(`${BASE_URL}/get_playlists`);
    return res;
}

export { mapTrackFilterSelections, generateTrackResLinkHTML, generateTrackResLinkPlaybackHTML, getPlaylists };