const mongoose = require('mongoose');
const { Schema } = mongoose;

const SearchSchema = new Schema({
  query: String,
  timestamp: Number
});

const Search = mongoose.model('search', SearchSchema);

module.exports = Search;
