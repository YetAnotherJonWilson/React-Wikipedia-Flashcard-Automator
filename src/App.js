import React, { Component } from 'react';
import CardButton from './CardButton';
import { Button, Grid, Row, Col, FormGroup, ControlLabel, FormControl, Navbar } from 'react-bootstrap';
import{ BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

class App extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      fields: {
        title: ''
      },
      wikiCategories: [],
      wikiPageTitles: [],
      wikiListofLists: [],
      searchResultsHeaders : {
        visibility: 'hidden'
      }
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.fromCategoryToPageids = this.fromCategoryToPageids.bind(this);
  }

  onInputChange(evt) {
    const fields = this.state.fields;
    fields[evt.target.name] = evt.target.value;
    this.setState({ fields });
  }

  // Step one: Input a title for a list page, and use it to find the correct category for the specific list needed
  getCategories(evt) {
    if(evt.target.id === "button") {
      var listTitle = evt.target.innerHTML.split(" ");
      var listPageTitle = listTitle.join("%20");
    } else {
      var title = this.state.fields.title.split(" ");
      listPageTitle = title.join("%20");
    }
    if(listPageTitle === ''){
      this.setState({
        fields: {title: "Please enter a title"}
      })
      return;
    }
    fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=query&titles=${listPageTitle}&prop=categories&cllimit=max&format=json&formatversion=2`)
    .then(response => response.json())
    .then(
      (result) => {
        var categoriesList = result.query.pages[0].categories;
        if(categoriesList === undefined) { 
          return;
        }
        var categoriesArray = categoriesList.map((category) => {return category.title});
        document.querySelectorAll(".listHider").forEach(x => x.style.visibility = 'visible');
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
  
    this.setState({ fields: {title: ''}});
    evt.preventDefault();
  }

  // Step two: find the correct list using the appropriate category name
    // Sometimes this may require repeating this step with different 
    // category names until finding a list that contains the correct results
    // (i.e. names of Presidents, or Asian countries) listed
    // by page titles (not Category names), with correlated pageids
    // Note: Add ability to dynamically choose list limit based on expected number of results
  fromCategoryToPageids(evt) {
    var categoryTitlePlainText = evt.target.innerHTML;
    var categoryTitle = categoryTitlePlainText.split(" ").join("%20");
    
    fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=query&list=categorymembers&cmtitle=${categoryTitle}&cmlimit=100&format=json&formatversion=2`)
    .then(response => response.json())
    .then(
      (result) => {
        var categoriesList = result.query.categorymembers;
        var categoriesArray = categoriesList.map((category) => {return category.title});
        var wikiPageTitles = categoriesArray.filter(category => (!category.includes("Category") && !category.includes("List of") && !category.includes("Lists of")));
        var wikiListCategories = categoriesArray.filter(category => (category.includes("Category") && !category.includes("Category:List")));
        var wikiListofLists = categoriesArray.filter(category => (category.includes("List of") || category.includes("Lists of")));
        document.querySelectorAll(".otherListHider").forEach(x => x.style.visibility = 'visible');
        if(wikiPageTitles[0]){document.querySelector(".cardButton").style.visibility = 'visible'};
        this.setState({
          wikiCategories: wikiListCategories,
          wikiListofLists: wikiListofLists,
          wikiPageTitles: wikiPageTitles
        });
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
          <Navbar>
            <Navbar.Header>
              <Navbar.Brand>
                Wikipedia Flashcard Automator
              </Navbar.Brand>
            </Navbar.Header>
          </Navbar>
          <Router>
          <Grid>
            <Row>
              <Col md={4}></Col>
              <Col md={3}>
              <form onSubmit={this.getCategories}>
                <FormGroup>
                  <ControlLabel>Wikipedia page title:</ControlLabel>
                  <FormControl placeholder="Title" name= 'title' value={this.state.fields.title} onChange={this.onInputChange} />
                  <Button type="submit">Submit</Button>
                </FormGroup>
              </form>
              </Col>
            </Row>
            <Row>
            <Route exact={true} path="/" render={(props) => (
              <div>
              <Col md={4}>
                  <h2 className="listHider" style={{visibility: 'hidden'}}>Categories</h2>
                  <ul className="No-style-list">
                    { this.state.wikiCategories.map((category, i) => { 
                      return <div key={i} ><li><Button id="button" bsStyle="primary" onClick={this.fromCategoryToPageids}>{category}</Button></li></div>}
                    )}
                  </ul>
              </Col>
              <Col md={4}>
                <h2 className="otherListHider" style={{visibility: 'hidden'}}>Lists</h2>
                <ul className="No-style-list">
                { this.state.wikiListofLists.map((listItem, i) => { 
                  return <div key={i}><li><Button id="button" bsStyle="primary" onClick={this.getCategories}>{listItem}</Button></li></div>}
                  )}
                </ul>
              </Col>
              <Col md={4}>
                <h2 className="otherListHider" style={{visibility: 'hidden'}}>Page Titles</h2>
                <CardButton list={this.state.wikiPageTitles}></CardButton>
                <ul className="No-style-list">
                { this.state.wikiPageTitles.map((listItem, i) => { 
                    return <li key={i}>{listItem}</li>}
                  )}
                </ul>
              </Col>
              </div>
            )}></Route>
            </Row>
          </Grid>
        </Router>  
      </div>
    );
  }
}

export default App;
