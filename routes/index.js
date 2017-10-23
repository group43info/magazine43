var express = require('express');
// var router = express.Router();
var mongoose = require('../libs/mongoose.js');
var session = require('express-session');
var config = require('../config/index.js');
var MongoStore = require('connect-mongo')(session);
module.exports = function(app) {
  var bodyParser = require('body-parser');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  var sess = {
    secret: config.get('session:secret'),
    key: config.get('session:key'),
    cookie: config.get('session:cookie'),
    name: 'Antares',
    store: new MongoStore({url: 'mongodb://magazine43:qwerty43@ds119675.mlab.com:19675/magazine43'}), // connect-mongo session store
    proxy: true,
    resave: true,
    saveUninitialized: true
};
app.use(session(sess));
  app.get('/login', require('./login').get);


  app.get('/index', require('./main').get);
  app.get('/metodika-jornal', require('./jornal').get);
  app.get('/pz-jornal', require('./jornal').get);
  app.get('/trpz-jornal', require('./jornal').get);
  app.get('/pz-visit', require('./pz-visit').get);
  app.get('/admin/general', require('./admin/general').get);
  app.get('/admin/discipline', require('./admin/discipline').get);
  app.get('/admin/discipline/add', require('./admin/discipline/change').get);
  app.get('/admin/discipline/edit', require('./admin/discipline/change').get);
  app.get('/admin/discipline/delete', require('./admin/discipline/change').get);

  app.post('/forgot', require('./forgot').post);
  app.post('/signin', require('./signin').post);
  app.post('/signup', require('./signup').post);

  app.post('/admin/discipline/add', require('./admin/discipline/change').post);
  app.post('/admin/discipline/edit', require('./admin/discipline/change').post);
  app.post('/admin/discipline/delete', require('./admin/discipline/change').post);

  app.get('/disciplines', function(req, res) {
    mongoose.connection.db.collection('disciplines').find().toArray(function(err, docs) {
      if (err) {
        res.sendStatus(500);
      } else {
        // res.render('users_list', {users: docs});
        res.send(docs);
      }
    });
  });
  app.get('/users', function(req, res) {
    mongoose.connection.db.collection('users').find().toArray(function(err, docs) {
      if (err) {
        res.sendStatus(500);
      } else {
        // res.render('users_list', {users: docs});
        res.send(docs);
      }
    });
  });
  app.get('/unverified', function(req, res) {
    mongoose.connection.db.collection('unverified').find().toArray(function(err, docs) {
      if (err) {
        res.sendStatus(500);
      } else {
        // res.render('users_list', {users: docs});
        res.send(docs);
      }
    });
  });
  app.delete('/delete', function(req, res) {
    mongoose.connection.db.collection('users').remove({});
    mongoose.connection.db.collection('disciplines').remove({});

    res.sendStatus(200)
  });
  app.get('/', function(req, res) {
    res.redirect('login');
  });
};
