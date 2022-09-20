import React, { Component } from 'react';
import Form from './Form';
import UploadChart from './UploadChart';
import axios from 'axios';
import weekday from '../functions/weekdays';
import ErrorPage from './ErrorPage';
export default class UploadTimes extends Component {
  state = {
    heatTimes: [],
    title: '',
    loading: false,
    fullTimes: [],
    daysSinceUpload: 0,
    channelTitle: '',
    channelImg: '',
    error: false,
  };

  renderTitles = () => {
    return (
      <div className='infoContainer'>
        <button onClick={() => this.resetPage()} className='return-search-btn'>
          <i class='fa fa-home' />
          <i>go back</i>
        </button>
        <img
          crossOrigin='anonymous'
          className='avatar'
          src={this.state.channelImg}
        />
        <p>
          {this.state.channelTitle ?? this.state.title} usually post:{' '}
          <b>
            {weekday(this.state.heatTimes[0].days)} around{' '}
            {this.state.heatTimes[0].hours}
          </b>
          <br />
          days since last upload: <b>{this.state.daysSinceUpload}</b>
        </p>
      </div>
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
            <th>day</th>
            <th>time</th>
            <th>no upload streak</th>
          </tr>
          {this.state.fullTimes.map((element) => (
            <tr>
              <td>{element.days_full}</td>
              <td>{element.hours_full}</td>
              <td style={{ color: element.diff < 10 ? '#0099ff' : 'red' }}>
                {element.diff}
              </td>
            </tr>
          ))}
        </table>
      </div>
    );
  };

  resetPage = () => {
    this.setState({
      loading: false,
      error: false,
      heatTimes: '',
      fullTimes: '',
    });
  };

  handleSubmit = (event) => {
    this.setState({ loading: true, title: event });
    axios
      .get(`/channel/uploads?title=${event}`)
      .then((res) => {
        const heatTimes = res.data.data;
        const fullTimes = res.data.other;
        const daysSinceUpload = res.data.days_since_upload;
        const channelTitle = res.data.channel_name;
        const channelImg = res.data.channel_img;
        this.setState({
          heatTimes,
          loading: false,
          fullTimes,
          daysSinceUpload,
          channelImg,
          channelTitle,
        });
      })
      .catch((err) => this.setState({ error: true }));
  };
  render() {
    if (this.state.error) {
      return <ErrorPage resetPage={this.resetPage} />;
    }
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
