var express = require('express');
var router = express.Router();


/**
 * Page d'accueil
 */
router.get('/',function (req, res, next) {
    res.status(200);
});

/**
 * Telechargement de bulb
 */
router.get('/download',function (req, res, next) {
    res.status(200);
});


module.exports = router;