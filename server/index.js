const express = require('express');
const cors = require('cors');
const moment = require('moment');
const { google } = require('googleapis');
const service = google.youtube({
    version: 'v3',
    auth: process.env.AUTH_TICKET,
});
const path = require('path');

const app = express();

const port = process.env.PORT || 8080;

app.use(cors());

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.listen(port, () => {
    console.log('api is running');
});

app.get('/channel/uploads', async(req, res) => {
    const title = req.query.title;

    const channelID = await service.search.list({
        part: 'id',
        q: title,
        maxResults: 1,
        type: 'channel',
    });
    const parsedId = channelID.data.items[0].id.channelId;
    if (!parsedId) {
        res.status(404).send({
            data: 'No channel exists',
        });
    } else {
        const result = await service.search.list({
            part: 'snippet',
            channelId: parsedId,
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

        let arr = dates.map((date) => {
            return {
                days: moment(date).isoWeekday(),
                hours: moment(date).local().format('H'),
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
        });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// function findOcc(arr, key) {
//     let arr2 = [];

//     arr.forEach((x) => {
//         // Checking if there is any object in arr2
//         // which contains the key value
//         if (
//             arr2.some((val) => {
//                 return val[key] == x[key];
//             })
//         ) {
//             // If yes! then increase the occurrence by 1
//             arr2.forEach((k) => {
//                 if (k[key] === x[key]) {
//                     k['occurrence']++;
//                 }
//             });
//         } else {
//             // If not! Then create a new object initialize
//             // it with the present iteration key's value and
//             // set the occurrence to 1
//             let a = {};
//             a[key] = x[key];
//             a['occurrence'] = 1;
//             arr2.push(a);
//         }
//     });

//     return arr2;
// }