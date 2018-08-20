import React, { Component } from 'react';
import CardButton from './CardButton';
import ChooseDeck from './ChooseDeck';
import CategoryItems from './CategoryItems';
import SearchButton from './SearchButton';
import NavigationHeader from './NavigationHeader';
import { Grid, Row, Col, ListGroup, ListGroupItem } from 'react-bootstrap';
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

      openDeck: '',
      openDeckArray: []
    };

    this.changeFields = this.changeFields.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.toggleView = this.toggleView.bind(this);
    this.startSearch = this.startSearch.bind(this);
    this.setCardsState = this.setCardsState.bind(this);
    this.fromCategoryToPageids = this.fromCategoryToPageids.bind(this);
  }

  componentDidMount() {
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

      openDeck: '',
      openDeckArray: []
    });
  }

  changeFields(fields) {
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
  // Step two: find the correct list using the appropriate category name
  // Sometimes this may require repeating this step with different
  // category names until finding a list that contains the correct results
  // (i.e. names of Presidents, or Asian countries) listed
  // by page titles (not Category names), with correlated pageids
  // Note: Add ability to dynamically choose list limit based on expected number of results
  fromCategoryToPageids(evt) {
    var categoryTitle;
    if (typeof evt === 'string') {
      categoryTitle = evt;
    } else {
      evt.preventDefault();
      console.log(evt.target.innerHTML);
      var categoryTitlePlainText = evt.target.innerHTML;
      categoryTitle = categoryTitlePlainText.split(' ').join('%20');
      var correctCategoryTitle = categoryTitlePlainText.replace(
        'Category:',
        ''
      );
    }

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
  }

  // Step three
  setCardsState(extracts) {
    var newExtracts = this.state.cardItems.concat(extracts);
    this.setState({ cardItems: newExtracts });
  }

  toggleView(evt) {
    if (evt.target.innerHTML === 'Create a deck') {
      this.saveStateToLocalStorage();
      this.setState({ searchPage: true });
    } else {
      this.saveStateToLocalStorage();
      this.setState({ searchPage: false });
    }
  }

  render() {
    return (
      <div className="App">
        {/* Simple Storage handles localstorage */}
        <SimpleStorage parent={this} />
        <NavigationHeader toggleView={this.toggleView} />
        {this.state.searchPage && (
          <Grid>
            <Row>
              <Col md={4} />
              <Col md={3}>
                <SearchButton
                  fields={this.state.fields}
                  startSearch={this.startSearch}
                  changeFields={this.changeFields}
                />
              </Col>
            </Row>
            <Row>
              <div>
                <Col md={4}>
                  <div>
                    <h2>Categories</h2>
                    {this.state.wikiCategories.length === 0 && (
                      <h4 className="Infotext">
                        Wikipedia category titles will appear here
                      </h4>
                    )}
                    {this.state.wikiCategories && (
                      <CategoryItems
                        wikiCategories={this.state.wikiCategories}
                        fromCategoryToPageids={this.fromCategoryToPageids}
                      />
                    )}
                  </div>
                </Col>
                <Col md={4}>
                  <div className="List-column">
                    <h2>Lists</h2>
                    {this.state.wikiListofLists.length === 0 && (
                      <h4 className="Infotext">
                        Wikipedia list titles will appear here
                      </h4>
                    )}
                    {this.state.wikiCategories && (
                      <ListGroup>
                        {this.state.wikiListofLists.map((listItem, i) => (
                          <ListGroupItem
                            key={i}
                            id="button"
                            onClick={this.getCategories}
                          >
                            {listItem}
                          </ListGroupItem>
                        ))}
                      </ListGroup>
                    )}
                  </div>
                </Col>
                <Col md={4}>
                  <div className="List-column">
                    <h2>Page Titles</h2>

                    <CardButton
                      id="button"
                      setCardsState={this.setCardsState}
                      cardItems={this.state.cardItems}
                      listTitle={this.state.listTitle}
                      wikiPageTitles={this.state.wikiPageTitles}
                    />
                    <h4>List Title: {this.state.listTitle}</h4>
                    {this.state.wikiPageTitles.length === 0 && (
                      <h4 className="Infotext">
                        Wikipedia list of pages will appear here
                      </h4>
                    )}
                    {this.state.wikiPageTitles && (
                      <ListGroup>
                        {this.state.wikiPageTitles.map((title, i) => {
                          return <ListGroupItem key={i}>{title}</ListGroupItem>;
                        })}
                      </ListGroup>
                    )}
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
