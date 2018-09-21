var Board = require('../models/board')

function ReplyHandler() {
  
  this.getReply = function(req, res) {
    // For a given board and thread id, returns all replies
    // Does not display or return reported or delete_password parameters
    var boardName = req.params.board;
    var threadId = req.query.thread_id;
    
    Board.findOne({board: boardName}, function(err, board){
      if (err || board == null || board == []) {
        res.send("An error has occurred.")
      } else {
        var reqThread = board.threads.id(threadId);
        reqThread.replies.forEach((item) => {
          item.delete_password = undefined;
          item.reported = undefined;
        });
        reqThread.delete_password = undefined;
        reqThread.reported = undefined;
        
        res.json(reqThread);
        
      }
    });
    
    
  }
  
  this.postReply = function(req, res) {
    // New reply added to thread. Updates thread's bumped_on parameter.
    var boardName = req.params.board;
    var threadId = req.body.thread_id;
    var replyText = req.body.text;
    var delPass = req.body.delete_password;
    
    Board.findOne({board: boardName}, function(err, board) {
      if (err) {
        res.send("An error has occurred.")
      } else if (board == null || board == []) {
        res.send("Board not found.");
      } else {
        var reqThread = board.threads.id(threadId);
        var newReply = {
          text: replyText,
          created_on: new Date(),
          delete_password : delPass,
          reported: false
        };
        reqThread.bumped_on = new Date();
        reqThread.replies.push(newReply);
        board.save(function(err) {
          if (err) {
            res.send("Error saving new reply.");
          } else {
            res.redirect('back');
          }
        });
        
      }
    });
    
  }
  
  this.putReply = function(req, res) {
    // Finds reply by id and updates reported status to true
    var boardName = req.params.board;
    var threadId = req.body.thread_id;
    var replyId = req.body.reply_id
    
    Board.findOne({board: boardName}, function(err, board){
      if (err || board == null || board == []) {
        res.send("An error has occurred.")
      } else {
        var reportThread = board.threads.id(threadId);
        reportThread.replies.forEach((item) => {
          if (item._id == replyId) {
            item.reported = true;
          }
        });
        board.save(function(err) {
            if (err) {
              res.send("Error saving report status.");
            } else {
              res.send("success");
            }
          });
      }
    });
    
  }
  
  this.deleteReply = function(req, res) {
    // If correct delete_password is given, change reply's text to [deleted]
    var boardName = req.params.board;
    var threadId = req.body.thread_id;
    var replyId = req.body.reply_id;
    var delPass = req.body.delete_password;
    
    Board.findOne({board: boardName}, function(err, board){
      if (err || board == null || board == []) {
        res.send("An error has occurred.")
      } else {
        var delThread = board.threads.id(threadId);
        
        delThread.replies.forEach((item) => {
          if (item._id == replyId) {
            if (item.delete_password == delPass) {
              item.text = "[deleted]";
              board.save(function(err) {
                if (err) {
                  res.send("Error saving delete status.");
                } else {
                  res.send("success");
                }
              });
            } else {
              res.send("incorrect password");
            }
          }
        });
      }
      
    });
  }
  
}

module.exports = ReplyHandler;