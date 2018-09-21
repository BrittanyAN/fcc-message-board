/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var mongoose = require('mongoose');
var ReplyHandler = require('../controllers/replyHandler.js');
var ThreadHandler = require('../controllers/threadHandler.js');

module.exports = function (app) {
  
  // Connection to DB and Mongoose Schema and Model Set-up
  var CONNECTION_STRING = process.env.DB;
  
  mongoose.connect(CONNECTION_STRING);
  
  var replyHandler = new ReplyHandler();
  var threadHandler = new ThreadHandler();
  
  // Thread routing
  app.route('/api/threads/:board')
    .get(threadHandler.getThread)
    .post(threadHandler.postThread)
    .put(threadHandler.putThread)
    .delete(threadHandler.deleteThread);
  
  // Reply routing
  app.route('/api/replies/:board')
    .get(replyHandler.getReply)
    .post(replyHandler.postReply)
    .put(replyHandler.putReply)
    .delete(replyHandler.deleteReply);

};
