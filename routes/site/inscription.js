/**
 * Created by vince on 23/05/2017.
 */
var express = require('express');
var router = express.Router();

/**
 * Affiche la page d'inscription
 */
router.get('/',function (req, res, next) {
    res.render('inscription');
});

/**
 * Inscription d'un utilisateur
 */
router.post('/',function (req, res, next) {
    res.render('inscription');
});


module.exports = router;