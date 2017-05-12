var express = require('express');
var router = express.Router();

let variables = {
    title : 'Plugins'
};

/**
 * Affiche la liste de tous les plugins disponible
 */
router.get('/',function (req, res, next) {
    res.render('plugin',variables);
});

/**
 * Description d'un plugin spécifique
 */
router.get('/plugins/:id',function (req, res, next) {
    res.render('plugin',variables);
});


module.exports = router;