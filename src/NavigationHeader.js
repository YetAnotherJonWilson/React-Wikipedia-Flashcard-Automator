import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

export default function NavigationHeader(props) {
  return (
    <Navbar>
      <div className="Navbar-row">
        <Nav>
          <NavItem onClick={props.toggleView}>Create a deck</NavItem>
          <NavItem onClick={props.toggleView}>See all decks</NavItem>
        </Nav>
        <Navbar.Header>
          <Navbar.Brand>Wikipedia Flashcard Automator</Navbar.Brand>
        </Navbar.Header>
      </div>
    </Navbar>
  );
}
