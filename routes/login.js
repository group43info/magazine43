
exports.get = function(req, res) {
  req.session.user = undefined;
  res.render('login');
};
