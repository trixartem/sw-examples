var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', type: 'index' });
});
router.get('/offline', function(req, res, next) {
  res.render('offline', { title: 'Express', type: 'offline' });
});

module.exports = router;
