import React, { Component } from 'react';
import CardButton from './CardButton';
import ChooseDeck from './ChooseDeck';
import CategoryItems from './CategoryItems';
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
      },
      openDeck: '',
      openDeckArray: []
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.createCards = this.createCards.bind(this);
    this.toggleView = this.toggleView.bind(this);
    this.startSearch = this.startSearch.bind(this);
    this.chooseCategory = this.chooseCategory.bind(this);
    this.setCardsState - this.setCardsState.bind(this);
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
      },
      openDeck: '',
      openDeckArray: []
    });
  }

  onInputChange(evt) {
    const fields = this.state.fields;
    fields[evt.target.name] = evt.target.value;
    this.setState({ fields });
  }

  startSearch(evt) {
    evt.preventDefault();
    console.log('event: ', evt);
    console.log('this.state.fields.title: ', this.state.fields.title);
    if (this.state.fields.title.includes('Category:')) {
      var categorySearchTitle = this.state.fields.title.split(' ');
      var categoryPageTitle = categorySearchTitle.join('%20');
      this.fromCategoryToPageids(categoryPageTitle);
    } else {
      this.getCategories(evt);
    }
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

  // Step Two
  chooseCategory(
    correctCategoryTitle,
    wikiListCategories,
    wikiListofLists,
    wikiPageTitles
  ) {
    this.setState({
      listTitle: correctCategoryTitle,
      wikiCategories: wikiListCategories,
      wikiListofLists: wikiListofLists,
      wikiPageTitles: wikiPageTitles
    });
  }

  // Step three
  setCardsState(extracts) {
    this.setState({ cardItems: extracts });
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
      },
      openDeck: '',
      openDeckArray: []
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
                <form onSubmit={this.startSearch}>
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
                  <div className="listHider" style={{ visibility: 'hidden' }}>
                    <h2>Categories</h2>
                    <CategoryItems
                      wikiCategories={this.state.wikiCategories}
                      onChooseCategory={this.chooseCategory}
                    />
                  </div>
                </Col>
                <Col md={4}>
                  <div
                    className="otherListHider"
                    style={{ visibility: 'hidden' }}
                  >
                    <h2>Lists</h2>
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
                  </div>
                </Col>
                <Col md={4}>
                  <div
                    className="otherListHider"
                    style={{ visibility: 'hidden' }}
                  >
                    <h2>Page Titles</h2>
                    <CardButton
                      id="button"
                      setCardsState={this.setCardsState}
                    />
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
                  </div>
                </Col>
              </div>
            </Row>
          </Grid>
        )}

        {!this.state.searchPage && (
          <ChooseDeck cardItems={this.state.cardItems} />
        )}
      </div>
    );
  }
}

export default App;
