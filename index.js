#!/usr/bin/env node

const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const getCurrentIp = require('./helpers/getCurrentIp');
const getCurrentTime = require('./helpers/getCurrentTime');
const logger = require('./middlewares/logger');
const normalize = require('./helpers/normalize');

const {
  imgur: { clientId, apiUrl, sort }
} = JSON.parse(fs.readFileSync('./.env', 'utf8'));

mongoose.Promise = global.Promise;
// mongoose.connect();

const PORT = process.argv[2] || 3000;
const currentIp = getCurrentIp();
const currentTime = getCurrentTime();

const app = express();

app.set('view engine', 'ejs');
app.use(logger);
app.use(express.static('public'));
app.use(express.json());

app.get('/', (_, res) => {
  res.render('index', {}, (err, html) => {
    res.send(html);
  });
});

app.get('/search/:query', (req, res) => {
  const { query } = req.params;

  axios
    .get(`${apiUrl}/${sort}?q=${query}`, {
      headers: { Authorization: `Client-ID ${clientId}` }
    })
    .then(normalize)
    .then(data => res.send(data))
    .catch(error => {
      console.error(error);
      res.sendStatus(500);
    });
});

app.listen(PORT, () =>
  console.log(
    `[${currentTime}] express is running at http://${currentIp}:${PORT}`
  )
);
