import React from "react";

class Result extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      areEpisodesShown: false
    };
    this.showEpisodes = this.showEpisodes.bind(this);
  }

  showEpisodes() {
    this.setState({ areEpisodesShown: !this.state.areEpisodesShown });
  }

  render() {
    var tvShowImage;
    if (this.props.tvShowImageUrl) {
      tvShowImage = <img src={this.props.tvShowImageUrl} />;
    } else {
      tvShowImage = (
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg" />
      );
    }
    return (
      <div className="result">
        {tvShowImage}
        <div>
          <h2>{this.props.tvShowTitle}</h2>
          <div
            dangerouslySetInnerHTML={createMarkup(this.props.tvShowDescription)}
          ></div>
          <div className="hide-show-episodes" onClick={this.showEpisodes}>
            {this.state.areEpisodesShown ? (
              <p>Hide Episode List</p>
            ) : (
              <p>Show Episode List</p>
            )}
            {this.state.areEpisodesShown && (
              <EpisodeList episodes={this.props.tvShowEpisodes} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

function createMarkup(html) {
  return { __html: html };
}

function EpisodeList(props) {
  var episodeList = props.episodes.map(episode => (
    <EpisodeListItem
      season={episode.season}
      number={episode.number}
      name={episode.name}
    />
  ));
  return (
    <div>
      {props.episodes.length < 1 && props.episodesGotten && (
        <p>No episodes available</p>
      )}
      <ul>{episodeList}</ul>
    </div>
  );
}

function EpisodeListItem(props) {
  return (
    <li>
      <span>
        Season {props.season} Episode {props.number}:
      </span>
      <span>
        <strong> {props.name}</strong>
      </span>
    </li>
  );
}

export default Result;
