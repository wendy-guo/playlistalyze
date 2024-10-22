"use strict";

class Playlists extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selected: 0 };
  }

  handleClick = (playlistNum) => {
    this.setState({ selected: playlistNum });
    console.log(this.state.selected);
  };

  render() {
    return (
      <div className="playlists">
        {this.props.playlists.map((pl, i) => {
          return (
            <Playlist
              selected={this.state.selected === i}
              key={i}
              num={i}
              name={pl}
              onClick={this.handleClick}
            />
          );
        })}
        <button className="submit-btn" onClick={() => this.props.onSubmit(this.state.selected)}>
          submit
        </button>
      </div>
    );
  }
}

class Playlist extends Playlists {
  render() {
    return (
      <button
        className={
          this.props.selected ? "playlist selected-playlist" : "playlist"
        }
        onClick={() => this.props.onClick(this.props.num)}
      >
        {this.props.name}
      </button>
    );
  }
}
