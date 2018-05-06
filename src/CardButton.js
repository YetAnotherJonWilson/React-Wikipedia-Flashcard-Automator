import React, { Component } from 'react';
import {Button} from 'react-bootstrap';

class CardButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cardItems: []
        }
    
        this.createCards = this.createCards.bind(this);
      }

    // Step three: Use pageid's to get extracts in plaintext 
  createCards(evt) {
    var pageTitles = [];
    this.props.list.forEach(title => {
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
                if(extracts.length === this.props.list.length) {
                    this.setState({cardItems: extracts});
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
            <div>
                <Button className="cardButton" style={{visibility: 'hidden'}} bsStyle='primary' onClick={this.createCards} >Create Flashcards from this List</Button>
                <ul className="No-style-list">{this.state.cardItems.map((x, i) => { 
                return <li key={i}>{x.title}</li>}
                )}</ul>
            </div>
        )
          
}
}

export default CardButton;