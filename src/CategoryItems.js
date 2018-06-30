import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

class CategoryItems extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.fromCategoryToPageids = this.fromCategoryToPageids.bind(this);
  }

  // Step two: find the correct list using the appropriate category name
  // Sometimes this may require repeating this step with different
  // category names until finding a list that contains the correct results
  // (i.e. names of Presidents, or Asian countries) listed
  // by page titles (not Category names), with correlated pageids
  // Note: Add ability to dynamically choose list limit based on expected number of results
  fromCategoryToPageids(evt) {
    // Run this to determine if this function is being called from the search button or from a category button
    this.props.onChooseCategory('I am from CategoryItems Component');
    return;

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
          document
            .querySelectorAll('.otherListHider')
            .forEach(x => (x.style.visibility = 'visible')); // eslint-disable-line
          if (wikiPageTitles[0]) {
            document.querySelector('.cardButton').style.visibility = 'visible';
          }
          // this.setState({
          //   listTitle: correctCategoryTitle,
          //   wikiCategories: wikiListCategories,
          //   wikiListofLists: wikiListofLists,
          //   wikiPageTitles: wikiPageTitles
          // });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          console.log(error);
        }
      );
  }

  render() {
    return (
      <div>
        <ListGroup>
          {this.props.wikiCategories.map((category, i) => {
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
      </div>
    );
  }
}

export default CategoryItems;
