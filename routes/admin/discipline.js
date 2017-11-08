
var mongoose = require('../../libs/mongoose.js');
exports.get = function(req, res) {
  mongoose.connection.db.collection('disciplines').find().toArray(function(err, docs) {
    if (err) throw err;
    mongoose.connection.db.collection('students').find().toArray(function(err, students) {
      if (err) throw err;
      res.render('admin/discipline', {discipline: docs, students: students});
    });
  });
};
