const express = require('express');
const cors = require('cors');
const moment = require('moment');
const { google } = require('googleapis');
var morgan = require('morgan');
const path = require('path');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3001;
var subdomain = require('express-subdomain');
app.use(cors());

app.use(morgan('combined'));
app.use(subdomain('ytuploads',express.static(path.resolve(__dirname, '../client/build'))));

app.listen(port, () => {
  console.log('api is running');
});

app.get('/channel/uploads', async (req, res) => {
  //spread out quotas limits
  function randomizeKey() {
    const switchNr = Math.floor(Math.random() * 4);
    switch (switchNr) {
      case 0:
        return process.env.AUTH_TICKET;
      case 1:
        return process.env.SECOND_TICKET;
      case 2:
        return process.env.THIRD_TICKET;
      case 3:
        return process.env.FOURTH_TICKET;
    }
  }
  const service = google.youtube({
    version: 'v3',
    auth: randomizeKey(),
  });

  const title = req.query.title;

  const channelRes = await service.search.list({
    part: 'id,snippet',
    q: title,
    maxResults: 1,
    type: 'channel',
  });
  const channelInfo = channelRes.data.items[0];
  if (!channelInfo) {
    res.status(404).send({
      data: 'No channel exists',
    });
  } else {
    const channelInfo = channelRes.data.items[0];
    const channelID = channelInfo.id.channelId;
    const channelName = channelInfo.snippet.title;
    const channelImg = channelInfo.snippet.thumbnails.medium.url;
    const result = await service.search.list({
      part: 'snippet',
      channelId: channelID,
      maxResults: 100,
      order: 'date',
    });

    const titles = result.data.items.map((item) => item.id.videoId);
    let dates = [];
    for (var i in titles) {
      if (titles[i]) {
        const uploadTimes = await service.videos.list({
          id: titles[i],
          part: 'snippet',
        });
        dates.push(uploadTimes.data.items[0].snippet.publishedAt);
      }
    }

    let days_since_upload =
      dates.length > 0 ? moment().diff(moment(dates[0]), 'days') : 0;

    let arr = dates.map((date, i) => {
      return {
        days: moment(date).local().isoWeekday(),
        hours: moment(date).local().format('H'),
        hours_full: moment(date).local().format('HH:mm'),
        days_full: moment(date).local().format('dddd, MMMM Do'),
        diff: dates[i + 1]
          ? moment(date).diff(moment(dates[i + 1]), 'days')
          : 0,
        quantity: 1,
      };
    });

    let objArray = [];

    arr.forEach((element) => {
      checkAndAdd(element);
    });

    function checkAndAdd(obj) {
      for (var i = 0; i < objArray.length; i++) {
        if (objArray[i].days === obj.days && objArray[i].hours === obj.hours) {
          objArray[i].quantity++;
          return; // exit loop and function
        }
      }
      objArray.push(obj);
    }

    objArray.sort((a, b) => {
      return b.quantity - a.quantity;
    });
    res.status(200).send({
      data: objArray,
      other: arr,
      days_since_upload,
      channel_name: channelName,
      channel_img: channelImg,
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});
