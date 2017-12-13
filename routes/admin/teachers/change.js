
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
         var teacher = {
          _id:user._id,
          name: req.body.name,
          surname: req.body.surname,
          email: req.body.email,
          password: confirmnumber,
          role: 'teacher',
          disciplines: []
    };
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
  }else if (url.pathname === '/admin/teachers/check') {
    mongoose.connection.db.collection('teachers').findOne({_id: ObjectID(req.body.id)}, function(err, teacher) {
      if(err) throw err;
      if(teacher) {
         mongoose.connection.db.collection('disciplines').find().toArray(function(err, disciplines) {
          if(err) throw err;
          if(disciplines) {
            var disciplines_to_list_id = [];
            var disciplines_to_list = disciplines;
            var index;
            for(var i = 0; i < disciplines.length; i++) {
              disciplines_to_list_id[i] = String(disciplines[i]._id);
            }
            for (var i = 0; i < disciplines.length; i++) {
              for (var j  = 0; j < teacher.disciplines.length; j++) {
                console.log(disciplines[i]);
                if(disciplines[i]._id == teacher.disciplines[j]) {
                  index = disciplines_to_list_id.indexOf(teacher.disciplines[j]);
                  disciplines_to_list_id.splice(index, 1);
                  disciplines_to_list.splice(index, 1);
                }
              }
            }
            console.log('disciplines_to_list ' + disciplines_to_list);
            res.send({disciplines: disciplines_to_list});
          } else {
            console.log('Not found disciplines!');
          }
         });
      } else {
        console.log('Not found teacher!');
      }
    });
  } else if (url.pathname === '/admin/teachers/add_discipline') {
    var teacher_id = req.body.teacher_id;
    console.log(teacher_id);
    var disciplines = [];
    var discipline_id = req.body.discipline_id;
    mongoose.connection.db.collection('teachers').findOne({_id: ObjectID(teacher_id)},
      function(err, doc) {
        if (err) throw err;
        if(doc) {
        disciplines = doc.disciplines;
        let count = 0;
        if (disciplines.length === 0) {
          console.log(typeof disciplines);
          disciplines.push(discipline_id);
        } else {
          disciplines.map(function(x) {
            if (x === discipline_id) {
              count = 1;
            }
          });
          if (count === 0) {
            disciplines.push(discipline_id);
          }
        }
        console.log('disciplines ' + disciplines);
        mongoose.connection.db.collection('teachers').updateOne({_id: ObjectID(teacher_id)},
          {$set: {disciplines: disciplines}}
        );
      } else {
        console.log('Not found!')
      }
    }
    );

  } else {
    console.log('bad');
  }
};
