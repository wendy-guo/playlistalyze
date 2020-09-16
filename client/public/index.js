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
          console.log("playlist response", pl_res);
          // for each playlist

          playlists.forEach((pl) => {
            playlistsNames.push(pl.name);
            $.ajax({
              url: `https://api.spotify.com/v1/playlists/${pl.id}/tracks`,
              headers: {
                Authorization: "Bearer " + access_token,
              },
              success: function (tracks_res) {
                var tracks = tracks_res.items;
                //console.log("tracks", tracks);
                tracks.forEach((tr) => {
                  // get album to get genre
                  tr.track.artists.forEach((artist) => {
                    $.ajax({
                      url: `https://api.spotify.com/v1/artists/${artist.id}`,
                      headers: {
                        Authorization: "Bearer " + access_token,
                      },
                      success: function (artist_res) {
                        //console.log(
                        //`album ${artist_res.name} genres ${artist_res.genres}`
                        //);
                        //console.log(artist_res);
                      },
                    });
                  });
                });
              },
            });
          });

          ReactDOM.render(e(Playlists), userPlaylists);
        },
      });
    } else {
      // render initial screen
      $("#login").show();
      $("#loggedin").hide();
    }

    /**
    document.getElementById("obtain-new-token").addEventListener(
      "click",
      function () {
        $.ajax({
          url: "/refresh_token",
          data: {
            refresh_token: refresh_token,
          },
        }).done(function (data) {
          access_token = data.access_token;
          oauthPlaceholder.innerHTML = oauthTemplate({
            access_token: access_token,
            refresh_token: refresh_token,
          });
        });
      },
      false
    );
    */
  }
})();
