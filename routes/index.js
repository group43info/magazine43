var express = require('express');
var router = express.Router();

module.exports = function(app) {
  app.get('/registration', require('./registration').get);
  app.post('/registration', require('./registration').post);
  app.get('/', function(req, res) {
    res.send('test');
  });

};
