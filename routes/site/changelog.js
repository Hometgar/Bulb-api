var express = require('express');
var router = express.Router();

/**
 * Affiche le changelog de la dernière version de Bulb
 */
router.get('/',function (req, res, next) {

    res.render('changelog',res.locals.pageVariables);
});


/**
 * Permet d'avoir le changelog d'une version spécifique de Bulb
 */
router.get('/:version',function (req, res, next) {
    res.render('changelog',res.locals.pageVariables);
});


module.exports = router;