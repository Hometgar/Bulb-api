/**
 * Created by vince on 23/05/2017.
 */
var express = require('express');
var router = express.Router();
var moduleUser = require('../../private/modules/Users');

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
    let email = req.body.email;
    let password = req.body.password;

    moduleUser.connection(email, password)
        .then((user)=>{
            console.log('then test');
            console.log(user);
        })
        .catch((err)=>{
            console.log(err.errorInfo);
        });
});


module.exports = router;