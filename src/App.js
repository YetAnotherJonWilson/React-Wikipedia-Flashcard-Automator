import React, { Component } from 'react';
import CardButton from './CardButton';
import {
  Button,
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl,
  Navbar,
  Nav,
  NavItem,
  ListGroup,
  ListGroupItem
} from 'react-bootstrap';
import SimpleStorage from 'react-simple-storage';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {
        title: ''
      },
      searchPage: true,
      listTitle: '',
      wikiCategories: [],
      wikiPageTitles: [],
      wikiListofLists: [],
      cardItems: [],
      searchResultsHeaders: {
        visibility: 'hidden'
      }
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.fromCategoryToPageids = this.fromCategoryToPageids.bind(this);
    this.createCards = this.createCards.bind(this);
    this.toggleView = this.toggleView.bind(this);
  }

  componentWillMount() {
    window.addEventListener(
      'beforeunload',
      this.saveStateToLocalStorage.bind(this)
    );
  }

  saveStateToLocalStorage() {
    this.setState({
      fields: {
        title: ''
      },
      searchPage: true,
      listTitle: '',
      wikiCategories: [],
      wikiPageTitles: [],
      wikiListofLists: [],
      searchResultsHeaders: {
        visibility: 'hidden'
      }
    });
  }

  onInputChange(evt) {
    const fields = this.state.fields;
    fields[evt.target.name] = evt.target.value;
    this.setState({ fields });
  }

  // Step one: Input a title for a list page, and use it to find the correct category for the specific list needed
  getCategories(evt) {
    if (evt.target.id === 'button') {
      var listTitle = evt.target.innerHTML.split(' ');
      var listPageTitle = listTitle.join('%20');
    } else {
      var title = this.state.fields.title.split(' ');
      listPageTitle = title.join('%20');
    }
    if (listPageTitle === '') {
      this.setState({
        fields: { title: 'Please enter a title' }
      });
      return;
    }
    fetch(
      `https://en.wikipedia.org/w/api.php?origin=*&action=query&titles=${listPageTitle}&prop=categories&cllimit=max&format=json&formatversion=2`
    ) // eslint-disable-line
      .then(response => response.json())
      .then(
        result => {
          var categoriesList = result.query.pages[0].categories;
          if (categoriesList === undefined) {
            return;
          }
          var categoriesArray = categoriesList.map(category => {
            return category.title;
          });
          document
            .querySelectorAll('.listHider')
            .forEach(x => (x.style.visibility = 'visible')); // eslint-disable-line
          this.setState({
            wikiCategories: categoriesArray
          });
          console.log(
            'this.state.wikiCategories (categoriesArray): ',
            this.state.wikiCategories
          );
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          console.log(error);
        }
      );

    this.setState({ fields: { title: '' } });
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
    var categoryTitle = categoryTitlePlainText.split(' ').join('%20');
    var correctCategoryTitle = categoryTitlePlainText.replace('Category:', '');

    fetch(
      `https://en.wikipedia.org/w/api.php?origin=*&action=query&list=categorymembers&cmtitle=${categoryTitle}&cmlimit=100&format=json&formatversion=2`
    ) // eslint-disable-line
      .then(response => response.json())
      .then(
        result => {
          var categoriesList = result.query.categorymembers;
          var categoriesArray = categoriesList.map(category => {
            return category.title;
          });
          var wikiPageTitles = categoriesArray.filter(
            category =>
              !category.includes('Category') &&
              !category.includes('List of') &&
              !category.includes('Lists of')
          );
          var wikiListCategories = categoriesArray.filter(
            category =>
              category.includes('Category') &&
              !category.includes('Category:List')
          );
          var wikiListofLists = categoriesArray.filter(
            category =>
              category.includes('List of') || category.includes('Lists of')
          );
          document
            .querySelectorAll('.otherListHider')
            .forEach(x => (x.style.visibility = 'visible')); // eslint-disable-line
          if (wikiPageTitles[0]) {
            document.querySelector('.cardButton').style.visibility = 'visible';
          }
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
        error => {
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
    var n = Math.ceil(pageTitles.length / 20);
    var pageTitlesArray = [];
    for (var i = 0; i < n; i++) {
      pageTitlesArray.push(pageTitles.splice(0, 19));
    }
    var fetchWiki = new Promise((resolve, reject) => {
      var extracts = [];
      pageTitlesArray.forEach((x, i, a) => {
        var titles = x.join('|');
        fetch(
          `https://en.wikipedia.org/w/api.php?origin=*&action=query&titles=${titles}&prop=extracts&exintro=true&format=json&formatversion=2`
        ) // eslint-disable-line
          .then(response => response.json())
          .then(
            result => {
              extracts = extracts.concat(result.query.pages);
              if (extracts.length === this.state.wikiPageTitles.length) {
                resolve(extracts);
              }
            },
            error => {
              console.log(error);
            }
          );
      });
    });

    fetchWiki.then(extracts => {
      console.log('extracts', extracts);
      var deckTitle = { title: this.state.listTitle };
      extracts.unshift(deckTitle);
      extracts = this.state.cardItems.concat(extracts);
      this.setState({ cardItems: extracts });
    });
  }

  toggleView(evt) {
    if (evt.target.innerHTML === 'Create a deck') {
      this.setState({ searchPage: true });
    } else {
      this.setState({ searchPage: false });
    }
  }

  componentWillUnmount() {
    this.setState({
      fields: {
        title: ''
      },
      searchPage: true,
      listTitle: '',
      wikiCategories: [],
      wikiPageTitles: [],
      wikiListofLists: [],
      searchResultsHeaders: {
        visibility: 'hidden'
      }
    });
  }

  render() {
    return (
      <div className="App">
        {/* Simple Storage handles localstorage */}
        <SimpleStorage parent={this} />
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>Wikipedia Flashcard Automator</Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <NavItem onClick={this.toggleView}>Create a deck</NavItem>
            <NavItem onClick={this.toggleView}>See all decks</NavItem>
          </Nav>
        </Navbar>
        {this.state.searchPage && (
          <Grid>
            <Row>
              <Col md={4} />
              <Col md={3}>
                <form onSubmit={this.getCategories}>
                  <FormGroup>
                    <ControlLabel>Wikipedia page title:</ControlLabel>
                    <FormControl
                      placeholder="Title"
                      name="title"
                      value={this.state.fields.title}
                      onChange={this.onInputChange}
                    />
                    <Button type="submit">Submit</Button>
                  </FormGroup>
                </form>
              </Col>
            </Row>
            <Row>
              <div>
                <Col md={4}>
                  <h2 className="listHider" style={{ visibility: 'hidden' }}>
                    Categories
                  </h2>
                  <ListGroup>
                    {this.state.wikiCategories.map((category, i) => {
                      return (
                        <ListGroupItem
                          key={i}
                          id="button"
                          onClick={this.fromCategoryToPageids}
                        >
                          {category}
                        </ListGroupItem>
                      );
                    })}
                  </ListGroup>
                </Col>
                <Col md={4}>
                  <h2
                    className="otherListHider"
                    style={{ visibility: 'hidden' }}
                  >
                    Lists
                  </h2>
                  <ListGroup>
                    {this.state.wikiListofLists.map((listItem, i) => {
                      return (
                        <ListGroupItem
                          key={i}
                          id="button"
                          onClick={this.getCategories}
                        >
                          {listItem}
                        </ListGroupItem>
                      );
                    })}
                  </ListGroup>
                </Col>
                <Col md={4}>
                  <h2
                    className="otherListHider"
                    style={{ visibility: 'hidden' }}
                  >
                    Page Titles
                  </h2>
                  <CardButton id="button" createCards={this.createCards} />
                  <h4
                    className="otherListHider"
                    style={{ visibility: 'hidden' }}
                  >
                    List Title: {this.state.listTitle}
                  </h4>
                  <ListGroup>
                    {this.state.wikiPageTitles.map((title, i) => {
                      return <ListGroupItem key={i}>{title}</ListGroupItem>;
                    })}
                  </ListGroup>
                </Col>
              </div>
            </Row>
          </Grid>
        )}

        {!this.state.searchPage && (
          <ul className="No-style-list">
            {this.state.cardItems.map((x, i) => {
              return <li key={i}>{x.title}</li>;
            })}
          </ul>
        )}
      </div>
    );
  }
}

export default App;
