/**
 * Created by vince on 23/05/2017.
 */
let express = require('express');
let router = express.Router();
let moduleUser = require('../../private/modules/Users');

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

    if(!req.body.email || !req.body.confEmail || !req.body.pwd || !req.body.confPwd || !req.body.pseudo){
        let params = {missingFields : true};
        return res.render('inscription',params);
    }
    console.log(req.body);
    moduleUser.addUser(req.body.pseudo,req.body.firstName,req.body.lastName,
                        req.body.email,req.body.confEmail,req.body.pwd,req.body.confPwd)

        .then((user)=>{
            console.log('then test');
            console.log(user);
        })
        .catch((err)=>{
            console.log(err);
        });
});


module.exports = router;