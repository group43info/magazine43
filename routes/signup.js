var ObjectID = require('mongodb').ObjectID;
var User = require('../models/users.js').User;
var AuthError = require('../models/users.js').AuthError;
var mongoose = require('../libs/mongoose.js');
exports.post = function(req, res, next) {
  if (req.body.email === 'admin@admin') {
    // res.redirect('admin/general')
    return res.json({
      status: 'ok',
      url: '/admin/general'
    });
  } else {
    var password = req.body.password;
    User.authhorize(req.body.email, password, function(err, user) {
      if (err) {
        if (err instanceof AuthError) {
          res.json('Не вірний пароль!')
        } else {
          return next(err);
        }
      } else {
        if (user === null || user === undefined) {
          return res.json('Hекоректно введені дані!');
        } else {
          req.session.user = user._id;
          return res.json({
            status: 'ok',
            url: '/index'
          });
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