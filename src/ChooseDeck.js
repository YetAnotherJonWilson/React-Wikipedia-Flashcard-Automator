import React, { Component } from 'react';
import {
  Grid,
  Row,
  Col,
  DropdownButton,
  MenuItem,
  PanelGroup,
  Panel
} from 'react-bootstrap';

class ChooseDeck extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openDeck: '',
      openDeckArray: []
    };

    this.chooseDeck = this.chooseDeck.bind(this);
  }

  chooseDeck(evt) {
    this.setState({ openDeck: evt.target.innerHTML });
    var tempDeckArray = [];
    this.props.cardItems.forEach((x, i) => {
      if (x[0].title === evt.target.innerHTML) {
        console.log('match');
        for (var y = 1; y < x.length; y++) {
          tempDeckArray.push(x[y]);
        }
      }
    });
    this.setState({ openDeckArray: tempDeckArray });
    console.log(this.state.openDeckArray);
    document.querySelector('#openDeck').style.visibility = 'visible';
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col md={3} />
          <Col md={6}>
            <DropdownButton title="Choose a deck" id="bg-nested-dropdown">
              {this.props.cardItems.map((x, i) => (
                <MenuItem onClick={this.chooseDeck} key={i}>
                  {x[0].title}
                </MenuItem>
              ))}
            </DropdownButton>
            <div id="openDeck" style={{ visibility: 'hidden' }}>
              <h3>{this.state.openDeck}</h3>
              <PanelGroup accordion id="Cards">
                {this.state.openDeckArray.map((z, k) => (
                  <Panel eventKey={k} key={k}>
                    <Panel.Heading>
                      <Panel.Title toggle>{z.title}</Panel.Title>
                    </Panel.Heading>
                    <Panel.Body collapsible>{z.extract}</Panel.Body>
                  </Panel>
                ))}
              </PanelGroup>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default ChooseDeck;
