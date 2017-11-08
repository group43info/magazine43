
var mongoose = require('../libs/mongoose.js');
var ObjectID = require('mongodb').ObjectID;
exports.get = function(req, res) {
  if (req.session.user === undefined || req.session.user === null) {
    res.sendStatus(404);
  } else {
      var url = require('url').parse(req.url);
      console.log(url);
      mongoose.connection.db.collection('disciplines').find().toArray(function(err, docs) {
        if (err) throw err;
        mongoose.connection.db.collection('users').findOne({_id: ObjectID(req.session.user)}, function(err, doc) {
          if (err) throw err;
          // var user = doc;
          res.render('index', {user: doc, disciplines: docs});
        });
      });

  }
};
