#!/usr/bin/env node

const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const getCurrentIp = require('./helpers/getCurrentIp');
const getCurrentTime = require('./helpers/getCurrentTime');
const logger = require('./middlewares/logger');
const normalize = require('./helpers/normalize');
const Search = require('./models/Search');

const { MONGO_URI, CLIENT_ID, API_URL, SORT } = process.env.NODE_ENV
  ? process.env
  : JSON.parse(fs.readFileSync('./.env', 'utf8'));

mongoose.Promise = global.Promise;
mongoose
  .connect(MONGO_URI)
  .catch(err => console.error('Failed to connect to DB:', err));

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
  const { offset } = req.query;

  const search = new Search({ query, timestamp: Date.now() });

  search
    .save()
    .then(search => console.log(`${search} was saved to DB`))
    .catch(err => console.error('Failed to save record into DB', err));

  axios
    .get(`${API_URL}/${SORT}/${offset}?q=${query}`, {
      headers: { Authorization: `Client-ID ${CLIENT_ID}` }
    })
    .then(normalize)
    .then(data => res.send(data))
    .catch(error => {
      console.error(error);
      res.sendStatus(500);
    });
});

app.get('/recent(/:amount)?', (req, res) => {
  const amount = parseInt(req.params.amount) || 10;
  const cleanUp = ({ query, timestamp }) => ({ query, timestamp });

  Search.find()
    .sort('-timestamp')
    .limit(amount)
    .then(result => res.send(result.map(cleanUp)))
    .catch(err => {
      console.error('Failed to get data from DB', err);
      res.sendStatus(500);
    });
});

app.listen(PORT, () =>
  console.log(
    `[${currentTime}] express is running at http://${currentIp}:${PORT}`
  )
);
