import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Result from "./components/Result";

import axios from "axios";

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
      var id = result.show.id;
      promises.push(axios.get(`http://api.tvmaze.com/shows/${id}/episodes`));
    });

    axios.all(promises).then(results => {
      for (let i = 0; i < results.length; i++) {
        showResults[i].episodes = results[i].data;
      }
      this.setState({ results: showResults });
    });
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

export default App;
