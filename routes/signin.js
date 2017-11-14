
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
  let allow_to_registration = '';
         mongoose.connection.db.collection('students').findOne({'name': req.body.name, 'surname': req.body.surname, 'hallbook': req.body.hallbook}, 
        	function (err, doc) {
          if (err) throw err;
          if(doc) {
          	allow_to_registration = 'ok';
          	allow();
          } else {
          	mongoose.connection.db.collection('teachers').findOne({'name': req.body.name, 'surname': req.body.surname}, function (err, doc2) {
          		if(err) throw err;
          		if(doc2) {
          			allow_to_registration = 'ok';
          			allow();
          		} else {
          			res.send('Користувача ' + req.body.name + ' ' + req.body.surname + ' не внесено до бази користувачів сайту!');
          		}
          	});
          }
        })

  function allow() {
  	User.registration(req.body.email, confirmnumber, function (err, user) {
    if (err) {
      if (err instanceof AuthError) {
        return res.send(403, err.message);
      } else {
        return next(err);
      }
    }
    var role = '';
    function add_params() {
    mongoose.connection.db.collection('users').updateOne({_id: ObjectID(user._id)},
      {$set: {hallbook: req.body.hallbook, name: req.body.name, surname: req.body.surname, role: role}}
    );
  }
    mongoose.connection.db.collection('teachers').findOne({'name': req.body.name, 'surname': req.body.surname}, function (err, doc) {
      if (err) throw err;
      if (doc) {
        role = 'teacher';
        add_params();
      } else {
        mongoose.connection.db.collection('students').findOne({'name': req.body.name, 'surname': req.body.surname, 'hallbook':req.body.hallbook}, 
        	function (err, doc) {
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
}
};
