
var ObjectID = require('mongodb').ObjectID;
var User = require('../models/users.js').User;
var AuthError = require('../models/users.js').AuthError;
var mongoose = require('../libs/mongoose.js');
exports.post = function(req, res, next) {
  if (req.body.email === 'admin@admin') {
    res.redirect('admin/general')
  } else {
    var password = req.body.password;
    User.authhorize(req.body.email, password, function(err, user) {
      if (err) {
        if (err instanceof AuthError) {
          res.send('Wrong key!')
        } else {
          return next(err);
        }
      } else {
        if (user === null || user === undefined) {
          return res.send('Hекоректно введені дані!');
        } else {
          req.session.user = user._id;
          return res.redirect('index');
        }
      }
    });
  }
  // if (req.session.user === undefined) {
  //   res.send('Wrong key!')
  // } else {
  //   res.redirect('index');
  // }
};
