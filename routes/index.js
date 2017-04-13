var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/game', function (req, res, next) {
    res.render('index', { title: 'Express', type: 'index', layout: 'layout-game' });
});
router.get('/game/offline', function (req, res, next) {
    res.render('offline', { title: 'Express', type: 'offline', layout: 'layout-game' });
});

router.get('/dump', function (req, res, next) {
    res.render('index2', { title: 'Express', layout: 'layout-dump' });
});

module.exports = router;
