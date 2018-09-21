/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
  var testText = "qwerttyuiopp";
  var testId1, testId2, testId3;

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      
      test('Create new thread', function(done) {
        chai.request(server)
          .post('/api/threads/testing')
          .send({text:testText, delete_password:'testing'})
          .end(function(err, res){
            assert.equal(res.status, 200);
          });
        
        chai.request(server)
          .post('/api/threads/testing')
          .send({text:"To be deleted", delete_password:'testing'})
          .end(function(err, res){
            assert.equal(res.status, 200);
            done();
          });
        
      });
    });
    
    suite('GET', function() {
      
      test('Get up to 10 most recent posts displaying up to 3 most recent replies', function(done) {
        chai.request(server)
        .get('/api/threads/testing')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body[0], '_id');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'bumped_on');
          assert.property(res.body[0], 'text');
          assert.property(res.body[0], 'replies');
          assert.notProperty(res.body[0], 'reported');
          assert.notProperty(res.body[0], 'delete_password');
          assert.isBelow(res.body[0].replies.length, 4);
          assert.isBelow(res.body.length, 11);
          testId1 = res.body[0]._id; //Will be kept for testing
          testId2 = res.body[1]._id; //Will be deleted in delete testing
          done();
        });
        
      });
      
    });
    
    suite('DELETE', function() {
      
      test('No deletion with wrong password', function(done) {
        chai.request(server)
        .delete('/api/threads/testing')
        .send({thread_id: testId1, delete_password: 'bad'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        });
      });
      
      test('Successful delete with correct password', function(done) {
        chai.request(server)
        .delete('/api/threads/testing')
        .send({thread_id: testId2, delete_password: 'testing'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
      
    });
    
    suite('PUT', function() {
      test('Successful report', function(done) {
        chai.request(server)
        .put('/api/threads/testing')
        .send({report_id: testId1})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
      
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test('Creating a reply', function(done) {
        chai.request(server)
        .post('/api/replies/testing')
        .send({thread_id: testId1, text:'testing replies', delete_password:'testing'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          done();
        });
      });
      
    });
    
    suite('GET', function() {
      test('Get all replies for given thread', function(done) {
        chai.request(server)
        .get('/api/replies/testing')
        .query({thread_id: testId1})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, '_id');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'bumped_on');
          assert.property(res.body, 'text');
          assert.property(res.body, 'replies');
          assert.notProperty(res.body, 'delete_password');
          assert.notProperty(res.body, 'reported');
          assert.notProperty(res.body.replies[0], 'delete_password');
          assert.notProperty(res.body.replies[0], 'reported');
          assert.equal(res.body.replies[res.body.replies.length-1].text, 'testing replies');
          testId3 = res.body.replies[res.body.replies.length-1]._id
          done();
        });
      });
      
    });
    
    suite('PUT', function() {
      test('Successful report', function(done) {
        chai.request(server)
        .put('/api/replies/testing')
        .send({thread_id: testId1, reply_id: testId3})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
      
    });
    
    suite('DELETE', function() {
      test('No deletion with wrong password', function(done) {
        chai.request(server)
        .delete('/api/replies/testing')
        .send({thread_id: testId1, reply_id: testId3, delete_password: 'bad'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        });
      });
      
      test('Successful delete with correct password', function(done) {
        chai.request(server)
        .delete('/api/replies/testing')
        .send({thread_id: testId1 ,reply_id: testId3, delete_password: 'testing'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
    });
    
  });

});
