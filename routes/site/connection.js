/**
 * Created by vince on 23/05/2017.
 */
var express = require('express');
var router = express.Router();
var moduleUser = require('../../private/modules/Users');

/**
 * Affiche la page de connexion
 */
router.get('/',function (req, res, next) {
    res.render('connection');
});

/**
 * Connexion d'un utilisateur
 */
router.post('/',function (req, res, next) {

    moduleUser.connection(req.body.email, req.body.pwd)
        .then((user)=>{
            return res.status(user.errorCode).json(user);
        })
        .catch((err)=>{
            let params = {};
            if(err.errorInfo === "BAD PASSWORD OR MAIL") {
                params.error = "Email ou mot de passe incorrect. Veuillez réessayer.";
                params.badPwdOrMail  = true;
                params.email =  req.body.email;
                return res.render('connection',params);
            }
            else if(err.errorInfo === "INVALID INFORMATIONS"){
                let params = {error : "Tous les champs doiveny être renseignés."};
                if(req.body.email) params.email = req.body.email;
                if(!req.body.email) params.missingEmail = true;
                if(req.body.pwd) params.pwd = req.body.pwd;
                if(!req.body.pwd) params.missingPwd = true;

                return res.render('connection',params);
            }
        });
});


module.exports = router;