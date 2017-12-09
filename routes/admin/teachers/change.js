
var ObjectID = require('mongodb').ObjectID;
var mongoose = require('../../../libs/mongoose.js');
var User = require('../../../models/users.js').User;
var AuthError = require('../../../models/users.js').AuthError;
var randomChars = require('random-chars');
var confirmnumber = randomChars.get(8);

exports.get = function(req, res) {
  mongoose.connection.db.collection('teachers').find().toArray(function(err, docs) {
    if (err) throw err;
    mongoose.connection.db.collection('disciplines').find().toArray(function(err, disciplines) {
      if (err) throw err;
        res.render('admin/teachers', {teachers: docs, disciplines: disciplines});
    });

  });
}

exports.post = function(req, res, next) {
  var url = require('url').parse(req.url);
  console.log('Url ' + url);
  if (url.pathname === '/admin/teachers/add') {

    var teacher = {
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      password: confirmnumber,
      role: 'teacher'
    };
    User.registration(req.body.email, "",confirmnumber, function(err, user) {
      if (err) {
        if (err instanceof AuthError) {
          res.send({status: 'bad'});
          // return res.send(403, err.message);
        } else {
          return next(err);
        }
      } else {
        mongoose.connection.db.collection('users').updateOne({_id: ObjectID(user._id)},
          {$set: {name: req.body.name, surname: req.body.surname, role: 'teacher'}}
        );
        req.session.user = user._id;
        mongoose.connection.db.collection('teachers').insert(teacher, function(err) {
          if (err) throw err;
        });
      }
    });
  } else if (url.pathname === '/admin/teachers/edit') {
    var rename, resurname, reemail, repassword;
    rename = req.body.rename;
    resurname = req.body.resurname;
    reemail = req.body.reemail;
    repassword = req.body.repassword;
    mongoose.connection.db.collection('teachers').findOne({_id: ObjectID(req.body._id)}, function(err, doc) {
      if (err) throw err;
      if (rename === '') {
        rename = doc.name;
      }
      if (resurname === '') {
        resurname = doc.surname;
      }
      if (reemail === '') {
        reemail = doc.email;
      }
      if (repassword === '') {
        repassword = doc.password;
      }
      mongoose.connection.db.collection('teachers').updateOne({_id: ObjectID(req.body._id)},
        {$set: {name: rename, surname: resurname, email: reemail, password: repassword, status: 'teacher'}}
      );
      res.send({name: rename, surname: resurname, email: reemail, password: repassword});
    });

  } else if (url.pathname === '/admin/teachers/delete') {
    var _id = req.body._id;
    mongoose.connection.db.collection('teachers').remove({_id: ObjectID(_id)});
  } else {
    console.log('bad');
  }
};
