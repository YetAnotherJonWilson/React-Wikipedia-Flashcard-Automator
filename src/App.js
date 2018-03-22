import React, { Component } from 'react';
import './App.css';

class App extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      wikiCategories: [],
      wikiList: '',
      wikiExtract: ''
    };

    this.getCategories = this.getCategories.bind(this);
    
  }

  componentDidMount() {
    // temp values for testing
    // for step two
    var categoryTitle = 'Southeast%20Asian%20countries';
    // for step three
    var pageids = 21490963;
    
    // Step two: find the correct list using the appropriate category name
    // Sometimes this may require repeating this step with different 
    // category names until finding a list that contains the correct results
    // (i.e. names of Presidents, or Asian countries) listed
    // by page titles (not Category names), with correlated pageids
    // Note: Add ability to dynamically choose list limit based on expected number of results
    fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=query&list=categorymembers&cmtitle=Category:${categoryTitle}&cmlimit=100&format=json&formatversion=2`)
    .then(response => response.json())
    .then(
      (result) => {
        this.setState({
          wikiList: result.query.categorymembers
        });
        console.log("List using Category Title: ", this.state.wikiList);
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        console.log(error);
      }
    );

    // Step three: Use pageid's to get extracts in plaintext 
    fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=query&pageids=${pageids}&prop=extracts&exintro=true&explaintext=true&format=json&formatversion=2`)
    .then(response => response.json())
    .then(
      (result) => {
        this.setState({
          wikiExtract: result.query.pages[0].extract
        });
        console.log("Extract derived from pageid: ", this.state.wikiExtract);
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        console.log(error);
      }
    );
  }

  // Step one: Input a title for a list page, and use it to find the correct category for the specific list needed
  getCategories(evt) {
    var title = this.refs.title.value.split(" ");
    var listPageTitle = title.join("%20");

    fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=query&titles=${listPageTitle}&prop=categories&cllimit=max&format=json&formatversion=2`)
    .then(response => response.json())
    .then(
      (result) => {
        var categoriesList = result.query.pages[0].categories;
        var categoriesArray = categoriesList.map((category) => {return category.title});
        this.setState({
          wikiCategories: categoriesArray
        });
        console.log("this.state.wikiCategories (categoriesArray): ", this.state.wikiCategories);
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        console.log(error);
      }
    );
    evt.preventDefault();
  }
  
  render() {
    
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Wikipedia Flashcard Automator</h1>
        </header>
        <form onSubmit={this.getCategories}>
          Wikipedia page title: <br />
          <input type="text" name="Page-title" ref='title' /><br />
          <input type="submit" value="Submit" />
        </form>
        <div>
          <h3>Categories</h3>
          <ul>
            { this.state.wikiCategories.map((category, i) => <li key={i}>{category}</li>)}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
