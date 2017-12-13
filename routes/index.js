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

  // app.get('/index/*', require('./jornal').get);
  app.get('/index/*/*', require('./jornal').get);
  app.post('/index/*', require('./jornal').post);
  // app.post('/index/*/addTheme', require('./jornal').post);
  // app.post('/index/*/givemark', require('./jornal').post);
  app.get('/admin/general', require('./admin/general').get);
  app.get('/admin/discipline', require('./admin/discipline').get);

  app.get('/admin/students', require('./admin/students/change').get);
  app.get('/admin/teachers', require('./admin/teachers/change').get);

  app.post('/forgot', require('./forgot').post);
  app.post('/signin', require('./signin').post);
  app.post('/signup', require('./signup').post);

  app.get('/admin/users', require('./admin/users/change').get);
  // discipline post
  app.post('/admin/discipline/add', require('./admin/discipline/change').post);
  app.post('/admin/discipline/edit', require('./admin/discipline/change').post);
  app.post('/admin/discipline/delete', require('./admin/discipline/change').post);
  app.post('/admin/discipline/check', require('./admin/discipline/change').post);
  app.post('/admin/discipline/add_student', require('./admin/discipline/change').post);

  // students post
  app.post('/admin/students/add', require('./admin/students/change').post);
  app.post('/admin/students/edit', require('./admin/students/change').post);
  app.post('/admin/students/delete', require('./admin/students/change').post);
  // teachers post
  app.post('/admin/teachers/add', require('./admin/teachers/change').post);
  app.post('/admin/teachers/edit', require('./admin/teachers/change').post);
  app.post('/admin/teachers/check', require('./admin/teachers/change').post);
  app.post('/admin/teachers/add_discipline', require('./admin/teachers/change').post);
  app.post('/admin/teachers/delete', require('./admin/teachers/change').post);
  app.get('/index/*', require('./jornal').get);
  // jornal post
  app.post('/index/*', require('./jornal').post);

 app.get('/marks', function(req, res) { 
      mongoose.connection.db.collection('marks').find().toArray(function(err, docs) {
      if (err) {
        res.sendStatus(500);
      } else {
        // res.render('users_list', {users: docs});
        res.send(docs);
      }
    });
 });
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
  app.get('/students', function(req, res) {
    mongoose.connection.db.collection('students').find().toArray(function(err, docs) {
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
  app.get('/teachers', function(req, res) {
    mongoose.connection.db.collection('teachers').find().toArray(function(err, docs) {
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
    mongoose.connection.db.collection('marks').remove({});
    res.sendStatus(200)
  });
  app.delete('/delete_students', function(req, res) {
    mongoose.connection.db.collection('students').remove({});
    res.sendStatus(200)
  });
  app.delete('/delete_teachers', function(req, res) {
    mongoose.connection.db.collection('teachers').remove({});
    res.sendStatus(200)
  });
    app.delete('/delete_marks', function(req, res) {
    mongoose.connection.db.collection('marks').remove({});
    res.sendStatus(200)
  });

  app.get('/', function(req, res) {
    res.redirect('login');
  });

};
