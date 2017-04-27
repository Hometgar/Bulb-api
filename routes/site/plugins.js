var express = require('express');
var router = express.Router();


/**
 * Affiche la liste de tous les plugins disponible
 */
router.get('/',function (req, res, next) {
    res.status(200);
});

/**
 * Description d'un plugin spécifique
 */
router.get('/plugins/:id',function (req, res, next) {
    res.status(200);
});


module.exports = router;