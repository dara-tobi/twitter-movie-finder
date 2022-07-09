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


const searchTweets = (query) => {
  axios.get(`https://api.twitter.com/2/tweets/search/recent?query=${query}&tweet.fields=context_annotations&expansions=author_id,in_reply_to_user_id,referenced_tweets.id`, {
    headers: {
      'Authorization': `Bearer ${bearerToken}`
    }
  }).then(response => {
    let tweets = response.data.data;
    let includes = response.data.includes;

    tweets.forEach(tweet => {
      let dataToBeEmitted = {
        msg: tweet.text,
        user: includes.users.find(user => user.id === tweet.author_id).username,
        timestamp: Date.now(),
        status_id: tweet.id
      }
      console.log('dataToBeEmitted', dataToBeEmitted)
      io.emit('', dataToBeEmitted);
    })
  })
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

setInterval(() => {
  searchTweets('"greatest film" OR "best film" OR "best movie" OR "greatest movie" OR "favourite film" OR "favourite movie"');  
}, 15000);


http.listen(port, () => console.log(`Listening on port ${port}`));