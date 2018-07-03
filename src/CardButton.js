import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

class CardButton extends Component {
  constructor(props) {
    super(props);

    this.createCards = this.createCards.bind(this);
  }

  // Use pageid's to get extracts in plaintext
  createCards(evt) {
    // check for duplicates
    var duplicatesArray = [];
    this.props.cardItems.forEach(x => {
      duplicatesArray.push(x[0].title);
    });
    if (duplicatesArray.includes(this.props.listTitle)) {
      console.log('contained');
      return;
    }

    var pageTitles = [];
    this.props.wikiPageTitles.forEach(title => {
      pageTitles.push(title);
    });
    console.log('PageTitlesLength: ', pageTitles.length);
    var n = Math.ceil(pageTitles.length / 20);
    var pageTitlesArray = [];
    for (var i = 0; i < n; i++) {
      pageTitlesArray.push(pageTitles.splice(0, 20));
    }
    var fetchWiki = new Promise((resolve, reject) => {
      var extracts = [];
      pageTitlesArray.forEach((x, i, a) => {
        var titles = x.join('|');
        titles = titles.replace('&', '%26');
        fetch(
          `https://en.wikipedia.org/w/api.php?origin=*&action=query&titles=${titles}&prop=extracts&exintro=true&format=json&formatversion=2`
        ) // eslint-disable-line
          .then(response => response.json())
          .then(
            result => {
              extracts = extracts.concat(result.query.pages);
              if (extracts.length === this.props.wikiPageTitles.length) {
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
      var deckTitle = { title: this.props.listTitle };
      extracts.unshift(deckTitle);
      extracts = [extracts];

      var regex = /(<([^>]+)>)/gi;
      for (var i = 0; i < extracts[0].length; i++) {
        if (extracts[0][i].extract) {
          extracts[0][i].extract = extracts[0][i].extract.replace(regex, '');
        }
        console.log(extracts[0][i].extract);
      }

      this.props.setCardsState(extracts);
    });
  }

  render() {
    return (
      <div>
        <Button
          className="cardButton"
          style={{ visibility: 'hidden' }}
          bsStyle="primary"
          onClick={this.createCards}
        >
          Create Flashcards from this List
        </Button>
      </div>
    );
  }
}

export default CardButton;
