
var ObjectID = require('mongodb').ObjectID;
var mongoose = require('../../../libs/mongoose.js');
var cyrillicToTranslit = require('cyrillic-to-translit-js');

exports.post = function(req, res) {
  var url = require('url').parse(req.url);
  if (url.pathname === '/admin/discipline/add') {
    var discipline = req.body.discipline;
    var students = [];
    var url = cyrillicToTranslit().transform(discipline, '_');
    mongoose.connection.db.collection('disciplines').insert({name: discipline, url: url, students: students});
    mongoose.connection.db.collection(url).insert({name_student: [{date: '01'}, {mark: '2'}]});
  } else if (url.pathname === '/admin/discipline/edit') {
    var renamediscipline = req.body.renamediscipline;
    var discipline = req.body.discipline;
    mongoose.connection.db.collection('disciplines').updateOne({_id: ObjectID(discipline)},
      {$set: {name: renamediscipline}}
    );
  } else if (url.pathname === '/admin/discipline/delete') {
    var subject = req.body.subject;
    mongoose.connection.db.collection('disciplines').remove({_id: ObjectID(subject)});
  } else if (url.pathname === '/admin/discipline/student_list') {
    res.send('student_list')
  } else if (url.pathname === '/admin/discipline/add_student') {
    var discipline_id = req.body.discipline_id
    var students = [];
    var student_id = req.body.student_id;
    mongoose.connection.db.collection('disciplines').findOne({_id: ObjectID(discipline_id)},
      function(err, doc) {
        if (err) throw err;
        students = doc.students;
        let count = 0;
        if (students.length === 0) {
          students.push(student_id);
        } else {
          students.map(function(x) {
            if (x === student_id) {
              count = 1;
            }
          });
          if (count === 0) {
            students.push(student_id);
          }
        }
        mongoose.connection.db.collection('disciplines').updateOne({_id: ObjectID(discipline_id)},
          {$set: {students: students}}
        );
      }
    );

  } else if(url.pathname === '/admin/discipline/check') {
      mongoose.connection.db.collection('disciplines').findOne({_id: ObjectID(req.body.id)},function(err, doc) {
    if (err) throw err;
    if(doc){
      console.log(doc)
    mongoose.connection.db.collection('students').find().toArray(function(err, students) {
      if (err) throw err;
      var students_to_list_id = [];
      var students_to_list = students;
      var index;
      for(var i = 0; i < students.length; i++) {
        students_to_list_id[i] = String(students[i]._id);
      }
      if(students) {
            for (var i = 0; i < students.length; i++) {
              for (var j  = 0; j < doc.students.length; j++) {
                if(students[i]._id == doc.students[j]) {
                  index = students_to_list_id.indexOf(doc.students[j]);
                  students_to_list_id.splice(index, 1);
                  students_to_list.splice(index, 1);
                }
              }
            }
    res.send({students: students_to_list});
      } else {
        console.log('Not found Students!')
      }
      
    });
  } else {
    console.log('Not found!')
  }
  });

  } else {
    console.log('bad');
  }
};
