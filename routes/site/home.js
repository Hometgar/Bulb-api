var express = require('express');
var router = express.Router();

/**
 * Page d'accueil
 */
router.get('/',function (req, res, next) {
    console.log(res.locals);
    res.render('home',res.locals.pageVariables);
});

/**
 * Page A propos
 */
router.get('/propos',function (req, res, next) {
    res.render('propos',res.locals.pageVariables);
});

/**
 * Telechargement de bulb
 */
router.get('/download',function (req, res, next) {
    console.log(res.locals)

});


module.exports = router;