import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

export default class SearchButton extends Component {
  constructor(props) {
    super(props);

    this.onInputChange = this.onInputChange.bind(this);
  }

  onInputChange(evt) {
    const fields = this.props.fields;
    fields[evt.target.name] = evt.target.value;
    this.props.changeFields(fields);
  }

  render() {
    return (
      <form onSubmit={this.props.startSearch}>
        <FormGroup>
          <ControlLabel>Wikipedia page title:</ControlLabel>
          <FormControl
            placeholder="Title"
            name="title"
            value={this.props.fields.title}
            onChange={this.onInputChange}
          />
          <Button bsStyle="primary" type="submit" className="Search-button">
            Submit
          </Button>
        </FormGroup>
      </form>
    );
  }
}
