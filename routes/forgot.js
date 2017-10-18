
var randomChars = require('random-chars');
var sendMessage = require('../libs/nodemailer');
var confirmnumber = randomChars.get(8);
var mongoose = require('../libs/mongoose.js');
var ObjectID = require('mongodb').ObjectID;
var User = require('../models/users.js').User;
var AuthError = require('../models/users.js').AuthError;
exports.post = function(req, res, next) {
  var email = req.body.email;
  mongoose.connection.db.collection('users').findOne({username: email}, function(err, doc) {
    if (err) throw err;
    if (doc) {
      sendMessage(confirmnumber, email);
      User.recuperation(doc._id, confirmnumber, function(err, user) {
        if (err) {
          if (err instanceof AuthError) {
            return res.send(403, err.message);
          } else {
            return next(err);
          }
        }
      });
        res.send('Ваш пароль відіслано на пошту!');

    } else {
      res.send('Коричтувач з цією поштою не зареєстрований!');
    }
  });
};
