import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

class NavigationHeader extends Component {
  render() {
    return (
      <Navbar>
        <div className="Navbar-row">
          <Nav>
            <NavItem onClick={this.props.toggleView}>Create a deck</NavItem>
            <NavItem onClick={this.props.toggleView}>See all decks</NavItem>
          </Nav>
          <Navbar.Header>
            <Navbar.Brand>Wikipedia Flashcard Automator</Navbar.Brand>
          </Navbar.Header>
        </div>
      </Navbar>
    );
  }
}

export default NavigationHeader;
