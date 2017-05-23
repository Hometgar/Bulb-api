/**
 * Created by vince on 23/05/2017.
 */
var express = require('express');
var router = express.Router();

/**
 * Affiche la lpage de connexion
 */
router.get('/',function (req, res, next) {
    res.render('connection');
});

/**
 * Connexion d'un utilisateur
 */
router.post('/',function (req, res, next) {
    res.render('plugin');
});


module.exports = router;