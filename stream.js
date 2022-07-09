require('dotenv').config()
const axios = require('axios');
const request = require('request');
const express = require("express");
const path = require('path');
const port = process.env.PORT || 5000;
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const assetsPath = path.join(__dirname, './');
app.use(express.static(assetsPath));
const bearerToken = process.env.BEARER_TOKEN;

// const rulesToAdd = [
//   {
//     "value": "greatest film",
//     "tag": "great films",
//   },
//   {
//     "value": "best film",
//     "tag": "great films",
//   },
//   {
//     "value": "best movie",
//     "tag": "great films",
//   },
//   {
//     "value": "greatest movie",
//     "tag": "great films",
//   },
//   {
//     "value": "favourite film",
//     "tag": "great films",
//   },
//   {
//     "value": "favourite movie",
//     "tag": "great films",
//   },
// ];

// const addRules = (rulesToAdd) => {
//   axios.post('https://api.twitter.com/2/tweets/search/stream/rules', {
//     add: rulesToAdd
//   }, {
//     headers: {
//       'Authorization': `Bearer ${bearerToken}`
//     }
//   }).then(response => {
//     console.log('response', response.data)
//   })
// }

// addRules(rulesToAdd);


const startStream = () => {
  const stream = request.get({
    url: 'https://api.twitter.com/2/tweets/search/stream?tweet.fields=context_annotations&expansions=author_id,in_reply_to_user_id,referenced_tweets.id',
    auth: {
      bearer: bearerToken,
    },
    timeout: 10000,
  });

  stream.on('data', data => {
    try {
      let json;
      data = data.toString('utf8').trim();
      if (data && data.length) {
        json = JSON.parse(data);
      }
      if (json) {
          io.emit('', {
            msg: json.data.text,
            user: json.includes.users.find(user => user.id === json.data.author_id).username,
            timestamp: Date.now(),
            status_id: json.data.id
          });
      }
    } catch (e) {
      console.log('error :: ', e)
      // Heartbeat received. Do nothing.
    }

  }).on('error', error => {
    if (error.code === 'ESOCKETTIMEDOUT') {
      stream.emit('timeout');
    }
  });
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

startStream();
http.listen(port, () => console.log(`Listening on port ${port}`));