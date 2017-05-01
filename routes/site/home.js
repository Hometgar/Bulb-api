var express = require('express');
var router = express.Router();


/**
 * Page d'accueil
 */
router.get('/',function (req, res, next) {
    let variables = {
        title: 'Home',
        css: 'stylesheets/home.css'
    };
    res.type('html');
    res.render('home',variables);
});

/**
 * Page A propos
 */
router.get('/propos',function (req, res, next) {
    res.type('html');
    res.render('propos',{title: 'A propos'});
});

/**
 * Telechargement de bulb
 */
router.get('/download',function (req, res, next) {

});


module.exports = router;