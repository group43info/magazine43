
var ObjectID = require('mongodb').ObjectID;
var mongoose = require('../../../libs/mongoose.js');

exports.get = function(req, res) {
  mongoose.connection.db.collection('students').find().toArray(function(err, docs) {
    if (err) throw err;
    res.render('admin/students', {students: docs});
  });
}

exports.post = function(req, res) {
  var url = require('url').parse(req.url);
  console.log('Url ' + url);
  if (url.pathname === '/admin/students/add') {
    var discipline = req.body.discipline;
    var student = {
      name: req.body.name,
      surname: req.body.surname,
      group: req.body.group,
      hallbook: req.body.hallbook
    };
    console.log(student);
    mongoose.connection.db.collection('students').insert(student, function(err) {
      if (err) throw err;
    });
  } else if (url.pathname === '/admin/students/edit') {
    var rename, resurname, regroup, rehallbook;
    rename = req.body.rename;
    resurname = req.body.resurname;
    regroup = req.body.regroup;
    rehallbook = req.body.rehallbook;
    mongoose.connection.db.collection('students').findOne({_id: ObjectID(req.body._id)}, function(err, doc) {
      if (err) throw err;
      if (rename === '') {
        rename = doc.name;
      }
      if (resurname === '') {
        resurname = doc.surname;
      }
      if (regroup === '') {
        regroup = doc.group;
      }
      if (rehallbook === '') {
        rehallbook = doc.hallbook;
      }
      mongoose.connection.db.collection('students').updateOne({_id: ObjectID(req.body._id)},
        {$set: {name: rename, surname: resurname, group: regroup, hallbook: rehallbook}}
      );
      res.send({name: rename, surname: resurname, group: regroup, hallbook: rehallbook});
    });

  } else if (url.pathname === '/admin/students/delete') {
    var _id = req.body._id;
    mongoose.connection.db.collection('students').remove({_id: ObjectID(_id)});
    mongoose.connection.db.collection('disciplines').find().toArray(function(err, docs) {
      if (err) throw err;
      var students_id = docs;
      docs.map(function(x) {
        if (x.students.length !== 0) {
          for (var i = 0; i < x.students.length; i++) {
            if (x.students[i] === _id) {
              students_id = x._id;
              x.students.splice(i, 1);
              console.log(x.students);
              mongoose.connection.db.collection('disciplines').update({_id: ObjectID(students_id)},
                {$set: {students: x.students}}, function(err) {
                  console.log(err);
                });
            }
          }
        }
      });
    });
    // доробити видалення студента з курсу
    // mongoose.connection.db.collection('disciplines').update({students[]});
  } else {
    console.log('bad');
  }
};
