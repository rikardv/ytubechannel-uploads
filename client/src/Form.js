import React, { Component } from 'react';

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.handleSubmit(this.state.value);
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Kanalens namn:
          <input
            type='text'
            name='name'
            value={this.state.value}
            onChange={this.handleChange}
          />
        </label>
        <input type='submit' value='Submit' />
      </form>
    );
  }
}
