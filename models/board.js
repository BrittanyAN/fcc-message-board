var mongoose = require('mongoose');

// Model for Board, contains Board, Thread and Reply schemas

var Schema = mongoose.Schema;

var replySchema = new Schema({
  text: String,
  delete_password: String,
  created_on: Date,
  reported: Boolean
});

var threadSchema = new Schema({
  text: String,
  created_on: Date,
  bumped_on: Date,
  reported: Boolean,
  delete_password: String,
  replies: [replySchema]
  ,replycount: {type: Number, default: 0}
});

var boardSchema = new Schema({
  board: String,
  threads: [threadSchema]
});

module.exports = mongoose.model('Board', boardSchema);