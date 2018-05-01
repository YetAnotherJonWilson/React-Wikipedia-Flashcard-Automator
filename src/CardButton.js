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
    var pageTitlesArray1 = pageTitles.slice(0, 19);
    var pageTitlesArray2 = pageTitles.slice(20, 39);
    var pageTitlesArray3 = pageTitles.slice(40, 59);
    var pageTitlesArray4 = pageTitles.slice(60, 79);
    var pageTitlesArray = [];
    pageTitlesArray.push(pageTitlesArray1, pageTitlesArray2, pageTitlesArray3, pageTitlesArray4);
    
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
                // console.clear();
                // console.log("Extracts derived from titles: ", this.state.wikiExtract);
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

  componentDidUpdate() {
    // console.log("Extracts derived from titles: ", this.state.wikiExtract);
    var extracts = this.state.wikiExtract;
    
    function myFunction() {
        if(extracts.length > 1 && Array.isArray(extracts[extracts.length - 1]) ) {
            extracts = extracts[0].concat(extracts[1]).concat(extracts[2]);
        }
        console.log("Extracts derived from titles: ", extracts);
    }
    if(this.state.wikiExtract !== undefined && this.state.wikiExtract.length !== 0) {
        setTimeout(myFunction, 500);
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