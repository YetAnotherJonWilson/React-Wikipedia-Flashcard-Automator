import React, { Component } from 'react';
import './App.css';

class App extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      fields: {
        title: '',
        resultsNumber: ''
      },
      wikiCategories: [],
      wikiList: [],
      wikiListTitles: [],
      wikiListCategories: [],
      wikiExtract: ''
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.fromCategoryToPageids = this.fromCategoryToPageids.bind(this);
    this.fromPageidsToExtracts = this.fromPageidsToExtracts.bind(this);
  }

  onInputChange(evt) {
    const fields = this.state.fields;
    fields[evt.target.name] = evt.target.value;
    this.setState({ fields });
  }

  // Step one: Input a title for a list page, and use it to find the correct category for the specific list needed
  getCategories(evt) {
    var title = this.state.fields.title.split(" ");
    var listPageTitle = title.join("%20");

    fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=query&titles=${listPageTitle}&prop=categories&cllimit=max&format=json&formatversion=2`)
    .then(response => response.json())
    .then(
      (result) => {
        var categoriesList = result.query.pages[0].categories;
        if(categoriesList === undefined) { 
          document.getElementById("Categories-section").style.display = "none";
          document.getElementById("No-categories").style.display = "block";
          return;
        }
        var categoriesArray = categoriesList.map((category) => {return category.title});
        this.setState({
          wikiCategories: categoriesArray
        });
        document.getElementById("No-categories").style.display = "none";
        document.getElementById("Categories-section").style.display = "block";
        console.log("this.state.wikiCategories (categoriesArray): ", this.state.wikiCategories);
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        console.log(error);
      }
    );
  
    this.setState({ fields: {title: '', resultsNumber: ''}});
    evt.preventDefault();
  }

  // Step two: find the correct list using the appropriate category name
    // Sometimes this may require repeating this step with different 
    // category names until finding a list that contains the correct results
    // (i.e. names of Presidents, or Asian countries) listed
    // by page titles (not Category names), with correlated pageids
    // Note: Add ability to dynamically choose list limit based on expected number of results
  fromCategoryToPageids(evt) {
    var categoryTitlePlainText = evt.target.previousSibling.innerHTML;
    var categoryTitle = categoryTitlePlainText.split(" ").join("%20");
    
    fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=query&list=categorymembers&cmtitle=${categoryTitle}&cmlimit=100&format=json&formatversion=2`)
    .then(response => response.json())
    .then(
      (result) => {
        var categoriesList = result.query.categorymembers;
        var categoriesArray = categoriesList.map((category) => {return category.title});
        var wikiListTitles = categoriesArray.filter(category => !category.includes("Category"));
        var wikiListCategories = categoriesArray.filter(category => category.includes("Category"));
        this.setState({
          wikiCategories: [],
          wikiList: categoriesArray,
          wikiListTitles: wikiListTitles,
          wikiListCategories: wikiListCategories
        });
        console.log(this.state.wikiList);
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        console.log(error);
      }
    );
    document.getElementById("Categories-section").style.display = "none";
    document.getElementById("List-of-results-section").style.display = "block";
    evt.preventDefault();
  }

  // Step three: Use pageid's to get extracts in plaintext 
  fromPageidsToExtracts(evt) {
    var pageids = 21490963;

    fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=query&pageids=${pageids}&prop=extracts&exintro=true&explaintext=true&format=json&formatversion=2`)
    .then(response => response.json())
    .then(
      (result) => {
        this.setState({
          wikiExtract: result.query.pages[0].extract
        });
        console.log("Extracts derived from pageids: ", this.state.wikiExtract);
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
        <form onSubmit={this.getCategories}>
          Wikipedia page title: <br />
          <input placeholder="Title" name= 'title' value={this.state.fields.title} onChange={this.onInputChange} /><br />
          <input placeholder="Number of results to show" name= 'resultsNumber' value={this.state.fields.resultsNumber} onChange={this.onInputChange} /><br />
          <input type="submit" value="Submit" />
        </form>
        <div id="No-categories">
          <h2>No Results Found</h2>
        </div>
        <div id="Categories-section">
          <h3>Categories</h3>
          <ul className="No-style-list">
            { this.state.wikiCategories.map((category, i) => { 
              return <div key={i} ><li>{category}</li><button onClick={this.fromCategoryToPageids} >Choose this one</button></div>}
            )}
          </ul>
        </div>
        <div id="List-of-results-section" >
          <h3>List of Results</h3>
          <h2>All Page Titles</h2>
          <ul className="No-style-list">
            { this.state.wikiListTitles.map((listItem, i) => { 
              return <li key={i}>{listItem}</li>}
            )}
          </ul>
          <h2>All Categories</h2>
          <ul className="No-style-list">
            { this.state.wikiListCategories.map((listItem, i) => { 
              return <li key={i}>{listItem}</li>}
            )}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
