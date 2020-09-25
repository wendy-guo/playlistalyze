(function () {
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

          let sortedArtistData = new Map();
          let sortedArtistGenreData = new Map();
          let sortedAlbumData = new Map();
          let sortedAlbumYearData = new Map();

          const displayResults = () => {
            console.log($("#analysis").css("display"));
            console.log(sortedArtistData);

            let shuffledArtistData = sortedArtistData
              .map((a) => ({ sort: Math.random(), value: a }))
              .sort((a, b) => a.sort - b.sort)
              .map((a) => a.value);

            let shuffledArtistGenreData = sortedArtistGenreData
              .map((a) => ({ sort: Math.random(), value: a }))
              .sort((a, b) => a.sort - b.sort)
              .map((a) => a.value);

            let shuffledAlbumData = sortedAlbumData
              .map((a) => ({
                sort: Math.random(),
                value: a,
              }))
              .sort((a, b) => a.sort - b.sort)
              .map((a) => a.value);

            let shuffledAlbumYearData = sortedAlbumYearData
              .map((a) => ({
                sort: Math.random(),
                value: a,
              }))
              .sort((a, b) => a.sort - b.sort)
              .map((a) => a.value);

            new Promise((resolve) => {
              $("#loading").hide();
              $("#analysis").show();
              $("#analysis").css({
                display: "flex",
                "flex-direction": "column",
              });

              resolve("done");
            }).then(() => {
              let artistChart = new Chart(
                document.getElementById("artist-chart").getContext("2d"),
                {
                  type: "pie",
                  data: {
                    labels: shuffledArtistData.map((arr) => arr[0]),
                    datasets: [
                      {
                        label: "# of tracks",
                        data: shuffledArtistData.map((arr) => arr[1]),
                        backgroundColor: [
                          "rgba(255, 204, 204, 0.6)",
                          "rgba(255, 245, 203, 0.6)",
                          "rgba(230, 238, 187, 0.6)",
                          "rgba(187, 238, 217, 0.6)",
                          "rgba(181, 236, 232, 0.6)",
                          "rgba(181, 211, 236, 0.6)",
                          "rgba(189, 181, 236, 0.6)",
                          "rgba(229, 186, 238, 0.6)",
                          "rgba(235, 163, 193, 0.6)",
                          "rgba(241, 181, 170, 0.6)",
                        ],
                        borderColor: [
                          "rgba(255, 204, 204, 1)",
                          "rgba(255, 245, 203, 1)",
                          "rgba(230, 238, 187, 1)",
                          "rgba(187, 238, 217, 1)",
                          "rgba(181, 236, 232, 1)",
                          "rgba(181, 211, 236, 1)",
                          "rgba(189, 181, 236, 1)",
                          "rgba(229, 186, 238, 1)",
                          "rgba(235, 163, 193, 1)",
                          "rgba(241, 181, 170, 1)",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  },
                  options: {
                    responsive: true,
                    animation: { duration: 1700 },
                    legend: {
                      labels: {
                        fontFamily: "Comfortaa",
                        fontColor: "black",
                      },
                    },
                  },
                }
              );

              let artistGenreChart = new Chart(
                document.getElementById("artist-genre-chart").getContext("2d"),
                {
                  type: "radar",
                  data: {
                    labels: shuffledArtistGenreData.map((arr) => arr[0]),
                    datasets: [
                      {
                        label: "# of tracks",
                        data: shuffledArtistGenreData.map((arr) => arr[1]),
                        backgroundColor: [
                          "rgba(255, 204, 204, 0.4)",
                          "rgba(255, 245, 203, 0.4)",
                          "rgba(230, 238, 187, 0.4)",
                          "rgba(187, 238, 217, 0.4)",
                          "rgba(181, 236, 232, 0.4)",
                          "rgba(181, 211, 236, 0.4)",
                          "rgba(189, 181, 236, 0.4)",
                          "rgba(229, 186, 238, 0.4)",
                          "rgba(235, 163, 193, 0.4)",
                          "rgba(241, 181, 170, 0.4)",
                        ],
                        borderColor: [
                          "rgba(255, 204, 204, 1)",
                          "rgba(255, 245, 203, 1)",
                          "rgba(230, 238, 187, 1)",
                          "rgba(187, 238, 217, 1)",
                          "rgba(181, 236, 232, 1)",
                          "rgba(181, 211, 236, 1)",
                          "rgba(189, 181, 236, 1)",
                          "rgba(229, 186, 238, 1)",
                          "rgba(235, 163, 193, 1)",
                          "rgba(241, 181, 170, 1)",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  },
                  options: {
                    responsive: true,
                    animation: { duration: 1700 },
                    legend: {
                      labels: {
                        fontFamily: "Comfortaa",
                        fontColor: "black",
                      },
                    },
                  },
                }
              );

              let albumChart = new Chart(
                document.getElementById("album-chart").getContext("2d"),
                {
                  type: "horizontalBar",
                  data: {
                    labels: shuffledAlbumData.map((arr) => arr[0]),
                    datasets: [
                      {
                        label: "# of tracks",
                        data: shuffledAlbumData.map((arr) => arr[1]),
                        backgroundColor: [
                          "rgba(255, 204, 204, 0.6)",
                          "rgba(255, 245, 203, 0.6)",
                          "rgba(230, 238, 187, 0.6)",
                          "rgba(187, 238, 217, 0.6)",
                          "rgba(181, 236, 232, 0.6)",
                          "rgba(181, 211, 236, 0.6)",
                          "rgba(189, 181, 236, 0.6)",
                          "rgba(229, 186, 238, 0.6)",
                          "rgba(235, 163, 193, 0.6)",
                          "rgba(241, 181, 170, 0.6)",
                        ],
                        borderColor: [
                          "rgba(255, 204, 204, 1)",
                          "rgba(255, 245, 203, 1)",
                          "rgba(230, 238, 187, 1)",
                          "rgba(187, 238, 217, 1)",
                          "rgba(181, 236, 232, 1)",
                          "rgba(181, 211, 236, 1)",
                          "rgba(189, 181, 236, 1)",
                          "rgba(229, 186, 238, 1)",
                          "rgba(235, 163, 193, 1)",
                          "rgba(241, 181, 170, 1)",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  },
                  options: {
                    responsive: true,
                    animation: { duration: 1700 },
                    legend: {
                      labels: {
                        fontFamily: "Comfortaa",
                        fontColor: "black",
                      },
                    },
                  },
                }
              );

              let albumYearChart = new Chart(
                document.getElementById("album-year-chart").getContext("2d"),
                {
                  type: "doughnut",
                  data: {
                    labels: shuffledAlbumYearData.map((arr) => arr[0]),
                    datasets: [
                      {
                        label: "# of tracks",
                        data: shuffledAlbumYearData.map((arr) => arr[1]),
                        backgroundColor: [
                          "rgba(255, 204, 204, 0.6)",
                          "rgba(255, 245, 203, 0.6)",
                          "rgba(230, 238, 187, 0.6)",
                          "rgba(187, 238, 217, 0.6)",
                          "rgba(181, 236, 232, 0.6)",
                          "rgba(181, 211, 236, 0.6)",
                          "rgba(189, 181, 236, 0.6)",
                          "rgba(229, 186, 238, 0.6)",
                          "rgba(235, 163, 193, 0.6)",
                          "rgba(241, 181, 170, 0.6)",
                        ],
                        borderColor: [
                          "rgba(255, 204, 204, 1)",
                          "rgba(255, 245, 203, 1)",
                          "rgba(230, 238, 187, 1)",
                          "rgba(187, 238, 217, 1)",
                          "rgba(181, 236, 232, 1)",
                          "rgba(181, 211, 236, 1)",
                          "rgba(189, 181, 236, 1)",
                          "rgba(229, 186, 238, 1)",
                          "rgba(235, 163, 193, 1)",
                          "rgba(241, 181, 170, 1)",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  },
                  options: {
                    responsive: true,
                    animation: { duration: 1700 },
                    legend: {
                      labels: {
                        fontFamily: "Comfortaa",
                        fontColor: "black",
                      },
                    },
                  },
                }
              );
            });
          };

          const analyzePlaylist = () => {
            console.log(playlistArtistData);

            // sort all the maps in asc ending order for frequency
            new Promise((resolve) => {
              sortedArtistData = Object.entries(playlistArtistData)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10);
              sortedArtistGenreData = Object.entries(playlistArtistGenreData)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 7);
              sortedAlbumData = Object.entries(playlistAlbumData)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 7);
              sortedAlbumYearData = Object.entries(playlistAlbumYearData)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 7);

              console.log(Object.keys(playlistArtistData).length);
              resolve();
            }).then(() => {
              displayResults();
            });
          };

          const handlePlaylistSubmit = (playlistNum) => {
            $("#logged-in").hide();
            $("#loading").show();
            $("#loading").css({
              display: "flex",
              "justify-content": "center",
              "margin-top": "50vh",
            });
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

                new Promise((resolve) => {
                  tracks.forEach((tr, i, arr) => {
                    // get album to get genre
                    tr.track.artists.forEach((artist) => {
                      artistIdData[artist.id] =
                        (artistIdData[artist.id] || 0) + 1;
                    });
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

                    if (i === arr.length - 1) {
                      resolve();
                    }
                  });
                })
                  .then(() => {
                    return new Promise((resolve) => {
                      Object.keys(artistIdData).forEach((artistId, i, arr) => {
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

                            console.log(i, playlistArtistData);

                            if (i === arr.length - 1) {
                              console.log(i, Object.keys(playlistArtistData));
                              resolve();
                            }
                          },
                        });
                      });
                    });
                  })
                  .then(() => {
                    console.log(playlistArtistData);
                    console.log(playlistArtistGenreData);
                    console.log(playlistAlbumData);
                    console.log(playlistAlbumYearData);
                    analyzePlaylist();
                  });
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
