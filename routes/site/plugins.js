var express = require('express');
var router = express.Router();

/**
 * Affiche la liste de tous les plugins disponible
 */
router.get('/',function (req, res, next) {
    res.render('plugin',res.locals.pageVariables);
});

/**
 * Description d'un plugin spécifique
 */
router.get('/plugins/:id',function (req, res, next) {
    res.render('plugin',res.locals.pageVariables);
});


module.exports = router;