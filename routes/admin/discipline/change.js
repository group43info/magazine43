
var ObjectID = require('mongodb').ObjectID;
var mongoose = require('../../../libs/mongoose.js');
exports.get = function(req, res) {
  var url = require('url').parse(req.url);
  // url = url.pathname.split('/');
  if (url.pathname === '/admin/discipline/add') {
    return res.send('add');
  } else if (url.pathname === '/admin/discipline/edit') {
    return res.send('edit');
  } else {
    return res.send('bad');
  }
};

exports.post = function(req, res) {
  var url = require('url').parse(req.url);
  if (url.pathname === '/admin/discipline/add') {
    var discipline = req.body.discipline;
    mongoose.connection.db.collection('disciplines').insert({name: discipline});
  } else if (url.pathname === '/admin/discipline/edit') {
    var renamediscipline = req.body.renamediscipline;
    var discipline = req.body.discipline;
    mongoose.connection.db.collection('disciplines').updateOne({_id: ObjectID(discipline)},
      {$set: {name: renamediscipline}}
    );
  } else if (url.pathname === '/admin/discipline/delete') {
    var subject = req.body.subject;
    console.log('Subject' + subject);
    mongoose.connection.db.collection('disciplines').remove({_id: ObjectID(subject)});
  } else {
    console.log('bad');
  }
};
