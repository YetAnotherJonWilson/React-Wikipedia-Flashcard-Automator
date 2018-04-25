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
    var testTitle = '';
    this.props.list.forEach(title => {
        testTitle = title;
        fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=query&titles=${testTitle}&prop=extracts&exintro=true&format=json&formatversion=2`)
        .then(response => response.json())
        .then(
        (result) => {
            this.setState({
            wikiExtract: this.state.wikiExtract + result.query.pages[0].extract
            });
            console.log("Extracts derived from titles: ", this.state.wikiExtract);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
            console.log(error);
        }
        );
    });
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