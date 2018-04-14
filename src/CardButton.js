import React, { Component } from 'react';
import {Button} from 'react-bootstrap';

class CardButton extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            
        };
    
      }
    render() {
        return (
            <div>
                <Button className="cardButton" style={{visibility: 'hidden'}} bsStyle='primary'>Create Flashcards from this List</Button>
            </div>
        )
          
}
}

export default CardButton;