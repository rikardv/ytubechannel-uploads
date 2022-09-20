import React, { Component } from 'react';

export default class ErrorPage extends Component {
  render() {
    return (
      <div>
        <button
          onClick={() => this.props.resetPage()}
          className='return-search-btn'
        >
          <i class='fa fa-home' />
          <i>go back</i>
        </button>
        <p>Something went wrong. Try with another channel...</p>
      </div>
    );
  }
}
