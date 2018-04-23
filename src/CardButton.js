import React, { Component } from 'react';
import {Button} from 'react-bootstrap';

class CardButton extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            
        };
        this.createCards = this.createCards.bind(this);
      }

    

    createCards(evt){
        console.clear();
        console.log("List: ", this.props.list);
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