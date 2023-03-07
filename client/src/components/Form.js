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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '90vh',
        }}
      >
        <div>
          <h3>Search for a youtube channel</h3>
        </div>
        <form onSubmit={this.handleSubmit} id='searchthis'>
          <input
            placeholder='PewDiePie'
            className={'namanyay-search-box'}
            type='text'
            name='name'
            value={this.state.value}
            onChange={this.handleChange}
          />

          <input className='namanyay-search-btn' type='submit' value='Search' />
        </form>
      </div>
    );
  }
}
