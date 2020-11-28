async function getArtistsTopTrack(BASE_URL, artistID) {
    const res = await axios.post(`${BASE_URL}/top-track`, {artistID});
    return res.data.tracks[0].id;
}

async function handleArtistFollow(BASE_URL, artistID) {
    const res = await axios.put(`${BASE_URL}/follow`, {artistID});
    return res;
}

async function handleArtistChoice(BASE_URL, currentArtistID) {
    const res = await axios.post(`${BASE_URL}/related-artist`, {currentArtistID});
    return res;
}

function generateArtistResLinkPlaybackHTML(artistID) {
    let html = $(`<div class="col-2">
                  <button type="button" class="link mb-1 btn btn-outline-success btn-block"
                          data-toggle="modal" data-target="#artistModal" data-artistid="${artistID}">
                      Listen
                  </button>
                </div>`);
    return html;
}

function generateArtistResLinkHTML(artistName, artistID) {
    let html = $(`<div class="col-8" id="${artistID}">
                  <button class="mb-1 ml-1 btn btn-outline-light btn-block" type="button">
                    ${artistName}
                  </button>
                </div>`);
    return html;
}

function generateArtistResLinkFollowHTML(i) {
    let html = $(`<div class="col-2">
                  <button id="follow-${i}" class="link mb-1 ml-2 btn btn-outline-success btn-block" type="button">Follow</button>
                </div>`);
    return html;
}

export { getArtistsTopTrack, handleArtistFollow, handleArtistChoice, 
         generateArtistResLinkPlaybackHTML, generateArtistResLinkHTML, generateArtistResLinkFollowHTML };