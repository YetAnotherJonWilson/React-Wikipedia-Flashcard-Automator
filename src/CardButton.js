import React, { Component } from 'react';
import {Button} from 'react-bootstrap';

class CardButton extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            wikiExtract: ''
        };
        this.createCards = this.createCards.bind(this);
      }

    // Step three: Use pageid's to get extracts in plaintext 
  createCards(evt) {
    console.clear();
    console.log(this.props.list);
    var pageTitles = [];
    this.props.list.forEach(title => {
        pageTitles.push(title);
    });
    var n = Math.ceil(pageTitles.length/20);
    var pageTitlesArray = [];
    for(var i = 0; i < n; i++) {
        pageTitlesArray.push(pageTitles.splice(0, 19));
    }
    
    var wikiExtract = [];
    pageTitlesArray.forEach((x, i) => {
        if(x !== undefined && x.length !== 0) {
            var titles = x.join("|");    
            fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=query&titles=${titles}&prop=extracts&exintro=true&format=json&formatversion=2`)
            .then(response => response.json())
            .then(
            (result) => {
                wikiExtract.push(result.query.pages);
                this.setState({
                wikiExtract: wikiExtract
                });
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

  componentWillUpdate() {
    var extracts = this.state.wikiExtract;
    
    if(this.state.wikiExtract !== undefined && this.state.wikiExtract.length !== 0) {
        if(extracts.length > 1 && Array.isArray(extracts[extracts.length - 1]) ) {
            var cardItems = [];
            extracts.forEach((x, i) => {
                cardItems = cardItems.concat(extracts[i]);
            })
        }
        console.log("Extracts derived from titles: ", cardItems);
    }
  }

    render() {
        return (
            <div>
                <Button className="cardButton" style={{visibility: 'hidden'}} bsStyle='primary' onClick={this.createCards} >Create Flashcards from this List</Button>
            </div>
        )
          
}
}

export default CardButton;