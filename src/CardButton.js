import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

class CardButton extends Component {
  render() {
    return (
      <div>
        <Button
          className="cardButton"
          style={{ visibility: 'hidden' }}
          bsStyle="primary"
          onClick={this.props.createCards}
        >
          Create Flashcards from this List
        </Button>
      </div>
    );
  }
}

export default CardButton;
