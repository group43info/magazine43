
var mongoose = require('../libs/mongoose.js');
var ObjectID = require('mongodb').ObjectID;
exports.get = function(req, res) {
  if (req.session.user === undefined || req.session.user === null) {
    res.sendStatus(404);
  } else {
      var url = require('url').parse(req.url);
      let disciplines_id = [];
      let disciplines = [];
      let index;
      mongoose.connection.db.collection('disciplines').find().toArray(function(err, docs) {
        if (err) throw err;
        disciplines = docs;
        mongoose.connection.db.collection('teachers').findOne({_id: ObjectID(req.session.user)}, function(err, teacher) {
          if(err) throw err;
          if(teacher) {
            if(teacher.disciplines.length === 0) {
              disciplines = [];
            } else {
              for (var i = 0; i < docs.length; i++){
                for (var j = 0; j < teacher.disciplines.length; j++){
                  if((String(docs[i]._id) !== teacher.disciplines[j])) {
                    disciplines.splice(i, 1);
                  }
                }
              }
            }
            console.log('disciplines ' + disciplines);
            res.render('index', {user: teacher, disciplines: disciplines});
          } else {
            console.log('test')
            mongoose.connection.db.collection('users').findOne({_id: ObjectID(req.session.user)}, function(err, doc) {
          if (err) throw err;
            res.render('index', {user: doc, disciplines: disciplines});
        });
          }
        });
        
        
      });

  }
};
