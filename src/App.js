import React, { Component } from 'react';
import './App.css';

class App extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      wikiExtract: ''
    };
    
  }

  componentDidMount() {
    fetch("https://en.wikipedia.org/w/api.php?origin=*&action=query&pageids=21490963&prop=extracts&exintro=true&explaintext=true&format=json&formatversion=2")
      .then(response => response.json())
      .then(
        (result) => {
          this.setState({
            wikiExtract: result.query.pages[0].extract
          });
          console.log(this.state);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
        }
      );
  }
  
  render() {
    
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Wikipedia Flashcard Automator</h1>
        </header>
        <form>
          Wikipedia page title: <br />
          <input type="text" name="Page-title" /><br />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default App;
