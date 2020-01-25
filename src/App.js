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
        this.getEpisodes(res.data);
      });
  }


  getEpisodes(showResults) {
    var promises = [];
    var showResults = showResults;

    showResults.forEach(function(result) {
      var id = result.show.id
      promises.push(axios.get(`http://api.tvmaze.com/shows/${id}/episodes`))
    })

    axios.all(promises).then((results) => {
      for (let i = 0; i < results.length; i++) {
        showResults[i].episodes = results[i].data
      }
      this.setState({results: showResults})
    })

  }

  render() {
    var allResults = this.state.results.map(result => {
      return (
        <Result
          tvShowTitle={result.show.name ? result.show.name : null}
          tvShowDescription={result.show.summary ? result.show.summary : null}
          tvShowImageUrl={result.show.image ? result.show.image.original : null}
          tvShowEpisodes={result.episodes ? result.episodes : null}
          tvShowId={result.show.id}
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
            {this.state.results && allResults}
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
      areEpisodesShown: false,
    };
    this.showEpisodes= this.showEpisodes.bind(this)
  }

  showEpisodes() {
    this.setState({areEpisodesShown: !this.state.areEpisodesShown})
  }


  render() {
    var tvShowImage;
    if (this.props.tvShowImageUrl) {
      tvShowImage = <img src={this.props.tvShowImageUrl} />;
    } else {
      tvShowImage = <img src="https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg" />;
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
            {this.state.areEpisodesShown ? <p>Hide Episode List</p> : <p>Show Episode List</p>}
            {this.state.areEpisodesShown && <EpisodeList episodes={this.props.tvShowEpisodes} />}
            
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
      <span>
        Season {props.season} Episode {props.number}:</span><span><strong> {props.name}</strong></span>
    </li>
  );
}

export default App;
