"use strict";

class Playlists extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selected: 0 };
  }

  handleClick = (playlistNum) => {
    this.setState({ selected: playlistNum });
  };

  render() {
    return (
      <div className="playlists">
        haiiiiiiii
        {this.props.playlists.map((pl, i) => {
          return (
            <Playlist key={i} num={i} name={pl} onClick={this.handleClick} />
          );
        })}
        <button onClick={() => this.props.onSubmit(this.state.selected)}>
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
        className="playlist"
        onClick={() => this.props.onClick(this.props.num)}
      >
        hello i'm playlist {this.props.num} {this.props.name}
      </button>
    );
  }
}
