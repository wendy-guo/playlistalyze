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

            new Promise((resolve) => {
              console.log("hai");
              $("#loading").hide();
              $("#analysis").show();
              while ($("#analysis").css("display") == "none") {}
              console.log($("#analysis").css("display"));
              resolve("done");
            }).then(() => {
              console.log(sortedArtistData.map((arr) => arr[0]));
              console.log(sortedArtistData.map((arr) => arr[1]));

              let artistChart = new Chart(
                document.getElementById("artist-chart").getContext("2d"),
                {
                  type: "pie",
                  data: {
                    labels: sortedArtistData.map((arr) => arr[0]).slice(0, 10),
                    datasets: [
                      {
                        label: "number of songs by artist",
                        data: sortedArtistData
                          .map((arr) => arr[1])
                          .slice(0, 10),
                        backgroundColor: [
                          "rgba(255, 99, 132, 0.2)",
                          "rgba(54, 162, 235, 0.2)",
                          "rgba(255, 206, 86, 0.2)",
                          "rgba(75, 192, 192, 0.2)",
                          "rgba(153, 102, 255, 0.2)",
                        ],
                        borderColor: [
                          "rgba(255, 99, 132, 1)",
                          "rgba(54, 162, 235, 1)",
                          "rgba(255, 206, 86, 1)",
                          "rgba(75, 192, 192, 1)",
                          "rgba(153, 102, 255, 1)",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  },
                  options: {
                    responsive: true,
                    animation: { duration: 1700 },
                  },
                }
              );

              let artistGenreChart = new Chart(
                document.getElementById("artist-genre-chart").getContext("2d"),
                {
                  type: "radar",
                  data: {
                    labels: sortedArtistGenreData
                      .map((arr) => arr[0])
                      .slice(0, 10),
                    datasets: [
                      {
                        label: "# of Votes",
                        data: sortedArtistGenreData
                          .map((arr) => arr[1])
                          .slice(0, 10),
                        backgroundColor: [
                          "rgba(255, 99, 132, 0.2)",
                          "rgba(54, 162, 235, 0.2)",
                          "rgba(255, 206, 86, 0.2)",
                          "rgba(75, 192, 192, 0.2)",
                          "rgba(153, 102, 255, 0.2)",
                          "rgba(255, 159, 64, 0.2)",
                        ],
                        borderColor: [
                          "rgba(255, 99, 132, 1)",
                          "rgba(54, 162, 235, 1)",
                          "rgba(255, 206, 86, 1)",
                          "rgba(75, 192, 192, 1)",
                          "rgba(153, 102, 255, 1)",
                          "rgba(255, 159, 64, 1)",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  },
                  options: {
                    responsive: true,
                    animation: { duration: 1700 },
                  },
                }
              );

              let albumChart = new Chart(
                document.getElementById("album-chart").getContext("2d"),
                {
                  type: "bar",
                  data: {
                    labels: sortedAlbumData.map((arr) => arr[0]).slice(0, 10),
                    datasets: [
                      {
                        label: "# of Votes",
                        data: sortedAlbumData.map((arr) => arr[1]).slice(0, 10),
                        backgroundColor: [
                          "rgba(255, 99, 132, 0.2)",
                          "rgba(54, 162, 235, 0.2)",
                          "rgba(255, 206, 86, 0.2)",
                          "rgba(75, 192, 192, 0.2)",
                          "rgba(153, 102, 255, 0.2)",
                          "rgba(255, 159, 64, 0.2)",
                        ],
                        borderColor: [
                          "rgba(255, 99, 132, 1)",
                          "rgba(54, 162, 235, 1)",
                          "rgba(255, 206, 86, 1)",
                          "rgba(75, 192, 192, 1)",
                          "rgba(153, 102, 255, 1)",
                          "rgba(255, 159, 64, 1)",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  },
                  options: {
                    responsive: true,
                    animation: { duration: 1700 },
                  },
                }
              );
            });
          };

          const analyzePlaylist = () => {
            console.log(playlistArtistData);

            // sort all the maps in asc ending order for frequency
            new Promise((resolve) => {
              sortedArtistData = Object.entries(playlistArtistData).sort(
                ([, a], [, b]) => b - a
              );
              sortedArtistGenreData = Object.entries(
                playlistArtistGenreData
              ).sort(([, a], [, b]) => b - a);
              sortedAlbumData = Object.entries(playlistAlbumData).sort(
                ([, a], [, b]) => b - a
              );
              sortedAlbumYearData = Object.entries(playlistAlbumYearData).sort(
                ([, a], [, b]) => b - a
              );

              /** 
              while (
                Object.keys(sortedArtistData).length !=
                  Object.keys(playlistArtistData).length ||
                Object.keys(sortedArtistGenreData).length !=
                  Object.keys(playlistArtistGenreData).length ||
                Object.keys(sortedAlbumData).length !=
                  Object.keys(playlistAlbumData).length ||
                Object.keys(sortedAlbumYearData).length !=
                  Object.keys(playlistAlbumYearData).length
              ) {
                console.log("sorting");
              } */

              while (
                sortedArtistData.length !=
                  Object.keys(playlistArtistData).length ||
                sortedArtistGenreData.length !=
                  Object.keys(playlistArtistGenreData).length ||
                sortedAlbumData.length !=
                  Object.keys(playlistAlbumData).length ||
                sortedAlbumYearData.length !=
                  Object.keys(playlistAlbumYearData).length
              ) {
                console.log("sorting");
              }

              console.log(Object.keys(playlistArtistData).length);
              resolve();
            }).then(() => {
              displayResults();
            });
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

                            console.log(playlistArtistData);

                            if (i === arr.length - 1) {
                              while (
                                Object.keys(playlistArtistData).length !=
                                i + 1
                              ) {
                                console.log(
                                  "haiiii",
                                  Object.keys(playlistArtistData).length
                                );
                              }
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
