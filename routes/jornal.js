
var ObjectID = require('mongodb').ObjectID;
var cyrillicToTranslit = require('cyrillic-to-translit-js');
var mongoose = require('../libs/mongoose.js');
exports.get = function(req, res) {
  if (req.session.user === undefined || req.session.user === null) {
    res.sendStatus(404);
  } else {
    var url = require('url').parse(req.url);
    url = url.pathname.split('/')[2];
    console.log(url);
    mongoose.connection.db.collection('disciplines').findOne({url: url}, function(err, doc) {
      if (err) throw err;
      if (doc) {
        mongoose.connection.db.collection('users').findOne({_id: ObjectID(req.session.user)}, function(err, user) {
          if (err) throw err;
          if(user.role === 'student'){
            res.render('journal', {discipline: doc, user: user});
          } else if (user.role === 'teacher') {
            res.render('journal_teacher', {discipline: doc, user: user});
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
  res.send('ok')
}
