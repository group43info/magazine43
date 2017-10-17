
var mongoose = require('../libs/mongoose.js');
var ObjectID = require('mongodb').ObjectID;
var User = require('../models/users.js').User;
var AuthError = require('../models/users.js').AuthError;
var random = require('random-number-generator');
var sendMessage = require('../libs/nodemailer');
var confirmnumber = random(10) + '' + random(10) + '' + random(10) + '' + random(10) + '' + random(10);
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
    mongoose.connection.db.collection('users').updateOne({_id: ObjectID(user._id)},
      {$set: {hallbook: req.body.hallbook}}
    );
    req.session.user = user._id;
    res.redirect('login');
  });
};
