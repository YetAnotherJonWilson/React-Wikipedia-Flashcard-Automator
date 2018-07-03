import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

class CategoryItems extends Component {
  constructor(props) {
    super(props);

    this.onCategoryClick = this.onCategoryClick.bind(this);
  }

  onCategoryClick(evt) {
    this.props.fromCategoryToPageids(evt);
  }

  render() {
    return (
      <div>
        <ListGroup>
          {this.props.wikiCategories.map((category, i) => {
            return (
              <ListGroupItem key={i} id="button" onClick={this.onCategoryClick}>
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
