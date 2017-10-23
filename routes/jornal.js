exports.get = function(req, res) {
  if (req.session.user === undefined || req.session.user === null) {
    res.sendStatus(404);
  } else {
    var url = require('url').parse(req.url);
    url = url.pathname.split('/')[1];
    console.log(url);
    switch (url) {
      case 'metodika-jornal':
        res.render('metodika-jornal');
        break;
      case 'pz-jornal':
        res.render('pz-jornal');
        break;
      case 'trpz-jornal':
        res.render('trpz-jornal');
        break;
    }
  }
};
