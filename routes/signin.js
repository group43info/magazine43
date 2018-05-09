var mongoose = require('../libs/mongoose.js');
var ObjectID = require('mongodb').ObjectID;
var User = require('../models/users.js').User;
var AuthError = require('../models/users.js').AuthError;
var randomChars = require('random-chars');
var sendMessage = require('../libs/nodemailer');
var validator = require('validator');
var confirmnumber = randomChars.get(8);
const {
  body,
  validationResult
} = require('express-validator/check');
const {
  sanitizeBody
} = require('express-validator/filter');

exports.post = function(req, res, next) {
  var email = req.body.email;
  var name = req.body.name;
  var surname = req.body.surname;
  var hallbook = req.body.hallbook;
  var requreFields = []; //= [email, name, surname, hallbook];
  var errors = [];
  var fields = Object.keys(req.body)
  var length = fields.length;
  for (let i = 0; i < length; i++) {
    requreFields[i] = req.body[fields[i]];
    if (validator.isEmpty(requreFields[i])) {
      errors.push('Поле ' + fields[i] + ' заповнено не вірно');
    } else if (!validator.isEmail(email)) {
      errors.push('Поле email заповнено не вірно');
    }
  }


  console.log(requreFields);
  console.log(errors);
  if (errors.length > 0) {
    return res.json('Заповніть всі поля вірно!')
  }
  let allow_to_registration = '';
  mongoose.connection.db.collection('students').findOne({
      'name': req.body.name,
      'surname': req.body.surname,
      'hallbook': req.body.hallbook
    },
    function(err, doc) {
      if (err) throw err;
      if (doc) {
        allow_to_registration = 'ok';
        allow();
      } else {
        mongoose.connection.db.collection('teachers').findOne({
          'name': req.body.name,
          'surname': req.body.surname
        }, function(err, doc2) {
          if (err) throw err;
          if (doc2) {
            allow_to_registration = 'ok';
            allow();
          } else {
            res.json('Користувача ' + req.body.name + ' ' + req.body.surname + ' не внесено до бази користувачів сайту!');
          }
        });
      }
    })

  function allow() {
    User.registration(req.body.email, req.body.hallbook, confirmnumber, function(err, user) {
      if (err) {
        if (err instanceof AuthError) {
          return res.send(403, err.message);
        } else {
          return next(err);
        }
      }
      var role = '';

      function add_params() {
        mongoose.connection.db.collection('users').updateOne({
          _id: ObjectID(user._id)
        }, {
          $set: {
            hallbook: req.body.hallbook,
            name: req.body.name,
            surname: req.body.surname,
            role: role
          }
        });
      }
      mongoose.connection.db.collection('teachers').findOne({
        'name': req.body.name,
        'surname': req.body.surname
      }, function(err, doc) {
        if (err) throw err;
        if (doc) {
          role = 'teacher';
          add_params();
        } else {
          mongoose.connection.db.collection('students').findOne({
              'name': req.body.name,
              'surname': req.body.surname,
              'hallbook': req.body.hallbook
            },
            function(err, doc) {
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
      sendMessage(confirmnumber, email);
      res.json('Пароль вислано на вказану вами пошту!');
    });
  }
};