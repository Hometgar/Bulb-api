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
 * Telechargement de bulb
 */
router.get('/download',function (req, res, next) {

});


module.exports = router;