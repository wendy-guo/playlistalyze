(function () {
  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */

  console.log("hello ^^");
  function getHashParams() {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  var userProfileSource = document.getElementById("user-profile-template")
      .innerHTML,
    userProfileTemplate = Handlebars.compile(userProfileSource),
    userProfilePlaceholder = document.getElementById("user-profile");

  var userPlaylists = document.getElementById("user-playlists");

  var params = getHashParams();

  var access_token = params.access_token,
    refresh_token = params.refresh_token,
    error = params.error;

  if (error) {
    alert("There was an error during the authentication");
  } else {
    if (access_token) {
      $.ajax({
        url: "https://api.spotify.com/v1/me",
        headers: {
          Authorization: "Bearer " + access_token,
        },
        success: function (response) {
          userProfilePlaceholder.innerHTML = userProfileTemplate(response);
          $("#login").hide();
          $("#loggedin").show();
        },
      });

      $.ajax({
        url: "https://api.spotify.com/v1/me/playlists",
        headers: {
          Authorization: "Bearer " + access_token,
        },
        success: function (pl_res) {
          var playlists = pl_res.items;
          var playlistsNames = [];
          var playlistsIds = [];

          let playlistArtistData = new Map();
          let playlistArtistGenreData = new Map();
          let playlistAlbumData = new Map();
          let playlistAlbumYearData = new Map();

          const analyzePlaylist = () => {
            let keywords = new Map();
            playlistArtistData = new Map(
              [...playlistArtistData.entries()].sort((a, b) => a[1] - b[1])
            );

            $("#loading").hide();
            $("#analysis").show();
          };

          const handlePlaylistSubmit = (playlistNum) => {
            $("#logged-in").hide();
            $("#loading").show();
            console.log("sending request for playlist tracks", playlistNum);
            $.ajax({
              url: `https://api.spotify.com/v1/playlists/${playlistsIds[playlistNum]}/tracks`,
              headers: {
                Authorization: "Bearer " + access_token,
              },
              success: function (tracks_res) {
                var tracks = tracks_res.items;
                var artistIdData = new Map();
                //console.log("tracks", tracks);
                tracks.forEach((tr) => {
                  // get album to get genre
                  tr.track.artists.forEach((artist) => {
                    console.log(artist);
                    artistIdData[artist.id] =
                      (artistIdData[artist.id] || 0) + 1;
                  });
                  console.log("hi", tr.track.album);
                  // album name data
                  playlistAlbumData[tr.track.album.name] =
                    (playlistAlbumData[tr.track.album.name] || 0) + 1;
                  // album release year data
                  playlistAlbumYearData[
                    tr.track.album.release_date.slice(0, 4)
                  ] =
                    (playlistAlbumYearData[
                      tr.track.album.release_date.slice(0, 4)
                    ] || 0) + 1;
                });

                Object.keys(artistIdData).forEach((artistId) => {
                  $.ajax({
                    url: `https://api.spotify.com/v1/artists/${artistId}`,
                    headers: {
                      Authorization: "Bearer " + access_token,
                    },
                    success: function (artist_res) {
                      playlistArtistData[artist_res.name] =
                        artistIdData[artistId];
                      artist_res.genres.forEach((genre) => {
                        playlistArtistGenreData[genre] =
                          (playlistArtistGenreData[genre] || 0) + 1;
                      });
                    },
                  });
                });

                console.log(playlistArtistData);
                console.log(playlistArtistGenreData);
                console.log(playlistAlbumData);
                console.log(playlistAlbumYearData);
                analyzePlaylist();
              },
            });
          };

          console.log("playlist response", pl_res);

          // add each playlist to array
          playlists.forEach((pl) => {
            playlistsNames.push([pl.name]);
            playlistsIds.push([pl.id]);
          });

          // render react component Playlists
          ReactDOM.render(
            <Playlists
              playlists={playlistsNames}
              onSubmit={handlePlaylistSubmit}
            />,
            userPlaylists
          );
        },
      });
    } else {
      // render initial screen
      console.log("initial screen");
      $("#login").show();
      $("#loggedin").hide();
    }
  }
})();
