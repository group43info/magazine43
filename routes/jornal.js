
var ObjectID = require('mongodb').ObjectID;
var cyrillicToTranslit = require('cyrillic-to-translit-js');
var mongoose = require('../libs/mongoose.js');
let info;
let marks = [];

exports.get = function(req, res) {
  if (req.session.user === undefined || req.session.user === null) {
    res.sendStatus(404);
  } else {
    var url = require('url').parse(req.url);
    url = url.pathname.split('/')[2];
    mongoose.connection.db.collection('disciplines').findOne({url: url}, function(err, discipline) {
      if (err) throw err;
      if (discipline) {
        mongoose.connection.db.collection('users').findOne({_id: ObjectID(req.session.user)}, function(err, user) {
          if (err) throw err;
          if(user.role === 'student'){
            var students_array = [];
            mongoose.connection.db.collection('students').find().toArray(function (err, students) {
              if (err) throw err;
                // for (var i = 0; i < students.length; i++) {
                    discipline.students.map(function(x) {
                      students.map(function(y) {
                        if (x == y._id) {
                          students_array.push(y);
                        }
                      })              
                    });
              mongoose.connection.db.collection('marks').findOne({"name": url}, function (err, result) {
                if(err) throw err;
                console.log(result);
                if(result) {
                res.render('journal', {discipline: discipline.name, user: user, students: students_array, marks: result.marks, date: result.date});
                } else {
                   res.render('journal', {discipline: discipline.name, user: user, students: students_array, marks: 0, date: 0});
                }
              });
            });
            
          } else if (user.role === 'teacher') {
            // var students = null;
            var students_array = [];
            mongoose.connection.db.collection('students').find().toArray(function (err, students) {
              if (err) throw err;
                // for (var i = 0; i < students.length; i++) {
                    discipline.students.map(function(x) {
                      students.map(function(y) {
                        if (x == y._id) {
                          students_array.push(y);
                        }
                      })              
                    });
              mongoose.connection.db.collection('marks').findOne({"name": url}, function (err, result) {
                if(err) throw err;
                console.log(result);
                if(result) {
                res.render('journal_teacher', {discipline: discipline.name, user: user, students: students_array, marks: result.marks, date: result.date});
                } else {
                   res.render('journal_teacher', {discipline: discipline.name, user: user, students: students_array, marks: 0, date: 0});
                }
              });
            });
          }
        });

      } else {
        res.sendStatus(404);
      }
    });
    // switch (url) {
    //   case 'metodika-jornal':
    //     res.render('metodika-jornal');
    //     break;
    //   case 'pz-jornal':
    //     res.render('pz-jornal');
    //     break;
    //   case 'trpz-jornal':
    //     res.render('trpz-jornal');
    //     break;
    // }
  }
};
exports.post = function (req, res) {
let marks = [];
let marks_to_server = [];
let date = [];
let url = require('url').parse(req.url);
let pathname = url.pathname.split('/')[2];
    if(url.pathname === '/index/' + pathname + '/givemark') {
      console.log(req.body.date + ' ' + req.body.mark);
       mongoose.connection.db.collection('marks').findOne({"name": pathname}, function (err, doc) {
         if(err) throw err;
         if(doc ){
          let index = doc.date.indexOf(req.body.date);
          let number_of_student = req.body.number_of_student;
          let mas_of_ = []; 
          let mark = req.body.mark;
            if(index > -1) {
              doc.marks[index][number_of_student] = mark;
              mongoose.connection.db.collection('marks').updateOne({"name": pathname},
                {$set: {marks: doc.marks}});
              res.send({mark: mark});
            }
         } else {
          console.log('error!');
         }
       });
    } else if(url.pathname === '/index/' + pathname + '/addTheme') {
      console.log('addTheme');
       mongoose.connection.db.collection('disciplines').findOne({"url": pathname}, function(err, discipline) {
        if(err) throw err;
        if(discipline) {
          discipline.students.map(function (x) {
            marks.push('');
          });
        mongoose.connection.db.collection('marks').findOne({"name": pathname}, function (err, result) {
          if (err) throw err;
          if (result) {
            marks_to_server = result.marks;
            marks_to_server.push(marks);
            date = result.date;
            date.push(req.body.date);
            mongoose.connection.db.collection('marks').updateOne({"name": pathname}, 
              {$set: {date: date,marks:marks_to_server}});
          } else {
            marks_to_server.push(marks);
            date.push(req.body.date);
            info = {
            name: discipline.url,
            date:date,
            theme: 'theme',
            marks: marks_to_server
            }
          mongoose.connection.db.collection('marks').insert(info);
          }
        });

        } else {
          console.log('Now found discipline');
        }
       });

    }
}
