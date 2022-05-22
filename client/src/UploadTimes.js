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
    this.setState({ loading: true, title: event});
    axios
      .get(`/channel/uploads?title=${event}`)
      .then((res) => {
        const dates = res.data.data;
        this.setState({
          dates,
          loading: false,
          daysFreq: res.data.occ_days,
          hoursFreq: res.data.occ_hours,
        });
      });
  };
  render() {
    if (this.state.loading) {
      return (
        <div>
          <h2>läser in data..</h2>
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
         {this.state.dates.length > 0 && <div style={{width: '100%',height: '100%'}}>  <h2>{this.state.title}</h2>
          <h3 style={{ fontWeight: 300 }}>
            brukast oftast lägga ut:{' '}
            <b>
              {weekday(this.state.daysFreq)} kl. {this.state.hoursFreq}{' '}
            </b>
          </h3>
          <div style={{ padding: 100, justifyContent: 'center' }}>
            <UploadChart data={this.state.dates} />
          </div></div>}

      </div>
    );
  }
}
