import React, { Component } from 'react';
import Form from './Form';
import UploadChart from './UploadChart';
import axios from 'axios';
import weekday from './functions/weekdays';
export default class UploadTimes extends Component {
  state = {
    heatTimes: [],
    title: '',
    loading: false,
    fullTimes: [],
    daysSinceUpload: 0,
  };

  renderTitles = () => {
    return (
      <p>
        {this.state.title} usually post:{' '}
        <b>
          {weekday(this.state.heatTimes[0].days)} around{' '}
          {this.state.heatTimes[0].hours}
        </b>
        <br />
        days since last upload: <b>{this.state.daysSinceUpload}</b>
      </p>
    );
  };

  renderGraph = () => {
    return (
      <div class='graph'>
        <p>Scatter plot</p>
        <UploadChart data={this.state.heatTimes} />
      </div>
    );
  };

  renderTable = () => {
    return (
      <div class='table'>
        <p>Latest uploads</p>
        <table style={{ width: '100%' }}>
          <tr>
            <th>Day of week</th>
            <th>Time of day</th>
          </tr>
          {this.state.fullTimes.map((element) => (
            <tr>
              <td>{element.days_full}</td>
              <td>{element.hours_full}</td>
            </tr>
          ))}
        </table>
      </div>
    );
  };

  handleSubmit = (event) => {
    this.setState({ loading: true, title: event });
    axios.get(`/channel/uploads?title=${event}`).then((res) => {
      const heatTimes = res.data.data;
      const fullTimes = res.data.other;
      const daysSinceUpload = res.data.days_since_upload;
      this.setState({
        heatTimes,
        loading: false,
        fullTimes,
        daysSinceUpload,
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

    if (this.state.fullTimes.length > 0 && this.state.heatTimes.length > 0) {
      return (
        <div style={{ width: '100%' }}>
          <Form handleSubmit={this.handleSubmit} />
          {this.renderTitles()}
          <div class='graphContainer'>
            {this.renderGraph()}
            {this.renderTable()}
          </div>
        </div>
      );
    }

    return <Form handleSubmit={this.handleSubmit} />;
  }
}
