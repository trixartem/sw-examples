var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/dump', function (req, res, next) {
    res.render('index', { title: 'Express', layout: 'layout-dump' });
});
router.get('/yasubbotnik', function (req, res, next) {
    res.render('index', { title: 'Express', layout: 'layout-yasubbotnik' });
});

module.exports = router;
