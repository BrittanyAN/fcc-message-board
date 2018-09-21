var Board = require('../models/board')

function ThreadHandler() {
  
  this.getThread = function(req, res) {
    // Gets up to 10 most recent thread for current board and returns up to 3 most recent replies per thread
    // Does not display or return reported or delete_password parameters
    var boardName = req.params.board;
    
    Board.findOne({board: boardName}, function(err, board){
      if (err || board == null || board == []) {
        res.send("An error has occurred.")
      } else {
        var descThreads = [...board.threads];
        descThreads.sort(function(a, b) {
          return b.bumped_on - a.bumped_on; //Newest bumped on top
        });
        
        var forLimit = descThreads.length > 10 ? 10 : descThreads.length;
        for (var i = 0; i < forLimit; i++) {

          descThreads[i].replycount = descThreads[i].replies.length;
          descThreads[i].replies.sort(function(a, b) {
            return a.created_on - b.created_on; //Newest reply on bottom
          });
          if (descThreads[i].replies.length > 3) {
            descThreads[i].replies = descThreads[i].replies.slice(-3);
          }
          
          descThreads[i].reported = undefined;
          descThreads[i].delete_password = undefined;
        }

        res.json(descThreads);
      }
    });
  }
  
  this.postThread = function(req, res) {
    // Adds new thread to board
    var boardName = req.params.board;
    var threadText = req.body.text;
    var threadDelPass = req.body.delete_password;
    
    Board.findOne({board: boardName}, function(err, board) {
      // Cases: 
      // Error handling
      // New Board
      // Add thread to existing board
      if (err) {
        res.send("An error has occurred.");
      } else if (board == null || board == []) {
        var newBoard = new Board({board: boardName});
        newBoard.threads.push({text: threadText, created_on: new Date(), bumped_on: new Date(), reported: false, delete_password: threadDelPass});
        newBoard.save(function(err) {
          if (err) {
            res.send("Error saving new board and thread.");
          } else {
            res.redirect('back');
          }
        });
      } else {
        board.threads.push({text: threadText, created_on: new Date(), bumped_on: new Date(), reported: false, delete_password: threadDelPass});
        board.save(function(err) {
          if (err) {
            res.send("Error saving new thread.");
          } else {
            res.redirect('back');
          }
        });
      }
      
    });
    
  }
  
  this.putThread = function(req, res) {
    // Finds thread by id and updates reported to true
    var boardName = req.params.board;
    var threadId = req.body.report_id;
    
    Board.findOne({board: boardName}, function(err, board) {
      if (err || board == null || board == []) {
        res.send("An error has occurred.")
      } else {
        var reportedThread = board.threads.id(threadId);
        reportedThread["reported"] = true;
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
  
  this.deleteThread = function(req, res) {
    // If correct delete_password is given, delete the given thread
    var boardName = req.params.board;
    var threadId = req.body.thread_id;
    var delPass = req.body.delete_password
    
    Board.findOne({board: boardName}, function(err, board) {
      if (err || board == null || board == []) {
        res.send("An error has occurred.")
      } else {
        var toDel = board.threads.id(threadId);
        if (toDel.delete_password === delPass) {
          toDel.remove();
          board.save(function(err) {
            if (err) {
              res.send("Error saving delete status.");
            } else {
              res.send("success");
            }
          });
        } else {
          res.send("incorrect password")
        }
      }
    });
  }
  
}

module.exports = ThreadHandler;