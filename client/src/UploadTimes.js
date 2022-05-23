import React, { Component } from 'react';
import Form from './Form';
import UploadChart from './UploadChart';
import axios from 'axios';
import weekday from './functions/weekdays';
export default class UploadTimes extends Component {
  state = {
    dates: [],
    title: '',
    loading: false,
    daysFreq: '',
    hoursFreq: '',
  };

  handleSubmit = (event) => {
    this.setState({ loading: true, title: event });
    axios.get(`/channel/uploads?title=${event}`).then((res) => {
      const dates = res.data.data;
      this.setState({
        dates,
        loading: false,
      });
    });
  };
  render() {
    if (this.state.loading) {
      return (
        <div class='middle'>
          <h3>Loading....</h3>
          <div class='bar bar1'></div>
          <div class='bar bar2'></div>
          <div class='bar bar3'></div>
          <div class='bar bar4'></div>
          <div class='bar bar5'></div>
          <div class='bar bar6'></div>
          <div class='bar bar7'></div>
          <div class='bar bar8'></div>
        </div>
      );
    }
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <Form handleSubmit={this.handleSubmit} />
        {this.state.dates.length > 0 && (
          <div style={{ width: '100%', height: '100%' }}>
            <h2> {this.state.title} </h2>
            <h3 style={{ fontWeight: 300 }}>
              usually post: <b> {weekday(this.state.dates[0].days)} </b> at{' '}
              {this.state.dates[0].hours}
            </h3>
            <div style={{ justifyContent: 'center' }}>
              <UploadChart data={this.state.dates} />
            </div>
          </div>
        )}
      </div>
    );
  }
}
