import React, { Component } from 'react';
import CardButton from './CardButton';
import { Button, Grid, Row, Col, FormGroup, ControlLabel, FormControl, Navbar, ListGroup, ListGroupItem } from 'react-bootstrap';
import './App.css';

class App extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      fields: {
        title: ''
      },
      listTitle: '',
      wikiCategories: [],
      wikiPageTitles: [],
      wikiListofLists: [],
      cardItems: [],
      searchResultsHeaders : {
        visibility: 'hidden'
      }
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.fromCategoryToPageids = this.fromCategoryToPageids.bind(this);
    this.createCards = this.createCards.bind(this);
  }

  componentWillMount() {
    const cache = localStorage.getItem('cardItems');
    if (cache) {
      console.log(JSON.parse(cache));
      // this.setState({ cardItems: JSON.parse(cache) });
      return;
    }
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
    var correctCategoryTitle = categoryTitlePlainText.replace('Category:', '');
    
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
          listTitle: correctCategoryTitle,
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

    // Step three: Use pageid's to get extracts in plaintext 
    createCards(evt) {
      var pageTitles = [];
      this.state.wikiPageTitles.forEach(title => {
          pageTitles.push(title);
      });
      var n = Math.ceil(pageTitles.length/20);
      var pageTitlesArray = [];
      for(var i = 0; i < n; i++) {
          pageTitlesArray.push(pageTitles.splice(0, 19));
      }
      var extracts = [];
      pageTitlesArray.forEach((x, i) => {
          if(x !== undefined && x.length !== 0) {
              var titles = x.join("|");    
              fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=query&titles=${titles}&prop=extracts&exintro=true&format=json&formatversion=2`)
              .then(response => response.json())
              .then(
              (result) => {
                  extracts = extracts.concat(result.query.pages);
                  if(extracts.length === this.state.wikiPageTitles.length) {
                      this.setState({cardItems: extracts});
                      console.log("extracts ", extracts);
                      localStorage.setItem('cardItems', JSON.stringify(extracts));
              }
              },
              // Note: it's important to handle errors here
              // instead of a catch() block so that we don't swallow
              // exceptions from actual bugs in components.
              (error) => {
                  console.log(error);
              }
              );
          }
      });
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
            { this.state.cardItems.length < 1 &&
              <div>
              <Col md={4}>
                  <h2 className="listHider" style={{visibility: 'hidden'}}>Categories</h2>
                  <ListGroup>
                  { this.state.wikiCategories.map((category, i) => { 
                      return <ListGroupItem key={i} id="button" onClick={this.fromCategoryToPageids}>{category}</ListGroupItem>}
                  )}
                  </ListGroup>
              </Col>
              <Col md={4}>
                <h2 className="otherListHider" style={{visibility: 'hidden'}}>Lists</h2>
                <ListGroup>
                { this.state.wikiListofLists.map((listItem, i) => { 
                  return <ListGroupItem key={i} id="button" onClick={this.getCategories}>{listItem}</ListGroupItem>}
                  )}
                </ListGroup>
              </Col>
              <Col md={4}>
                <h2 className="otherListHider" style={{visibility: 'hidden'}}>Page Titles</h2>
                <CardButton id="button" createCards={this.createCards} ></CardButton>
                <h4 className="otherListHider" style={{visibility: 'hidden'}}>List Title: {this.state.listTitle}</h4>
                <ListGroup>
                { this.state.wikiPageTitles.map((title, i) => { 
                  return <ListGroupItem key={i}>{title}</ListGroupItem>}
                )}
                </ListGroup>
              </Col>
              </div>
             }             <ul className="No-style-list">{this.state.cardItems.map((x, i) => { 
                return <li key={i}>{x.title}</li>}
                )}
              </ul>
            </Row>
          </Grid>
      </div>
    );
  }
}

export default App;
