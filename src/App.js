import React from "react";
import logo from "./logo.svg";
import "./App.css";

import axios from "axios";

function createMarkup(html) {
  return { __html: html };
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      results: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    axios.get(`http://api.tvmaze.com/search/shows?q=check`).then(res => {
      console.log(res);
    });
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    axios
      .get(`http://api.tvmaze.com/search/shows?q=${this.state.value}`)
      .then(res => {
        this.setState({ results: res.data });
      });
  }

  render() {
    var allResults = this.state.results.map(result => {
      return (
        <Result
          tvShowTitle={result.show.name ? result.show.name : null}
          tvShowDescription={result.show.summary ? result.show.summary : null}
          tvShowImageUrl={result.show.image ? result.show.image.original : null}
          tvShowEpisodes={result.show}
          tvShowId={result.show.id}
          getEpisodes={this.getEpisodes}
        />
      );
    });

    return (
      <div className="App">
        <header className="App-header">
<section className="section">
            <h1>TV Maze Finder</h1>
            <form className="finder-form" onSubmit={this.handleSubmit}>
              <label>
                Enter Show to Search: 
                <input
                  type="text"
                  value={this.state.value}
                  onChange={this.handleChange}
                />
              </label>
              <input type="submit" value="Submit" />
            </form>
</section>

          <section className="section">
            {allResults}
          </section>
        </header>
      </div>
    );
  }
}

class Result extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      episodes: [],
      episodesGotten: false,
    };
    this.getEpisodes = this.getEpisodes.bind(this);
  }

  getEpisodes(showId) {
    axios.get(`http://api.tvmaze.com/shows/${showId}/episodes`).then(res => {
      this.setState({ episodes: res.data, episodesGotten: true });
    });
  }

  render() {
    var tvShowImage;
    if (this.props.tvShowImageUrl) {
      tvShowImage = <img src={this.props.tvShowImageUrl} />;
    } else {
      tvShowImage = <p>Sorry, no image is available for this show...</p>;
    }
    return (
      <div className="result">
        {tvShowImage}
        <div>
          <h2>{this.props.tvShowTitle}</h2>
          <div
            dangerouslySetInnerHTML={createMarkup(this.props.tvShowDescription)}
          ></div>
          <div onClick={() => this.getEpisodes(this.props.tvShowId)}>
            Click here to get a list of episodes
            <EpisodeList episodes={this.state.episodes} episodesGotten={this.state.episodesGotten} />
          </div>
        </div>
      </div>
    );
  }
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
      {props.episodes.length < 1 && props.episodesGotten && <p>No episodes available</p>}
      <ul>{episodeList}</ul>
    </div>
  );
}

function EpisodeListItem(props) {
  return (
    <li>
      <p>
        Season {props.season} Episode {props.number}
      </p>{" "}
      <p>Episode Name: {props.name}</p>
    </li>
  );
}

export default App;
