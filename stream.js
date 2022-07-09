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

const rulesToAdd = [
  {
    "value": "greatest film",
    "tag": "great films",
  },
  {
    "value": "best film",
    "tag": "great films",
  },
  {
    "value": "best movie",
    "tag": "great films",
  },
  {
    "value": "greatest movie",
    "tag": "great films",
  },
  {
    "value": "favourite film",
    "tag": "great films",
  },
  {
    "value": "favourite movie",
    "tag": "great films",
  },
];

const addRules = (rulesToAdd) => {
  axios.post('https://api.twitter.com/2/tweets/search/stream/rules', {
    add: rulesToAdd
  }, {
    headers: {
      'Authorization': `Bearer ${bearerToken}`
    }
  }).then(response => {
    console.log('response', response.data)
  })
}

addRules(rulesToAdd);

