
var mongoose = require('../libs/mongoose.js');
var ObjectID = require('mongodb').ObjectID;
var User = require('../models/users.js').User;
var AuthError = require('../models/users.js').AuthError;
var randomChars = require('random-chars');
var sendMessage = require('../libs/nodemailer');
var confirmnumber = randomChars.get(8);
exports.post = function(req, res, next) {
  var email = req.body.email;
  sendMessage(confirmnumber, email);
  // var user = {
  //   name: req.body.name,
  //   surname: req.body.surname,
  //   email: req.body.email,
  //   password: req.body.password,
  //   repassword: req.body.repassword,
  //   hallbook: req.body.hallbook,
  //   confirmnumber: confirmnumber,
  //   status: 0
  // }
  User.registration(req.body.email, confirmnumber, function(err, user) {
    if (err) {
      if (err instanceof AuthError) {
        return res.send(403, err.message);
      } else {
        return next(err);
      }
    }
    function add_params() {
    mongoose.connection.db.collection('users').updateOne({_id: ObjectID(user._id)},
      {$set: {hallbook: req.body.hallbook, name: req.body.name, surname: req.body.surname, role: role}}
    );
  }
    var role = '';
    mongoose.connection.db.collection('teachers').findOne({'name': req.body.name, 'surname': req.body.surname}, function(err, doc) {
      if (err) throw err;
      if (doc) {
        role = 'teacher';
        add_params();
      } else {
        mongoose.connection.db.collection('students').findOne({'name': req.body.name, 'surname': req.body.surname}, function(err, doc) {
          if (err) throw err;
          if (doc) {
            role = 'student';
            add_params();
          } else {
            role = 'user';
            add_params();
          }
        })
      }
    })


    req.session.user = user._id;
    res.redirect('login');
  });
};
