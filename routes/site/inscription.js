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
    res.render('inscription',res.locals.pageVariables);
});

/**
 * Inscription d'un utilisateur
 */
router.post('/',function (req, res, next) {
    moduleUser.addUser(req.body.pseudo,req.body.firstName,req.body.lastName,
                        req.body.email,req.body.confEmail,req.body.pwd,req.body.confPwd)
        .then((user)=>{
            req.session.userRegistered = true;
            return res.redirect('/connection');
        })
        .catch((err)=>{

            // Renvoie les données sur les champs complétés ou met le nom du champ en rouge
            if(req.body.pseudo) res.locals.pageVariables.pseudo = req.body.pseudo;
            if(!req.body.pseudo) res.locals.pageVariables.missingPseudo = true;
            if(req.body.email) res.locals.pageVariables.email = req.body.email;
            if(!req.body.email) res.locals.pageVariables.missingEmail = true;
            if(req.body.confEmail) res.locals.pageVariables.confEmail = req.body.confEmail;
            if(!req.body.confEmail) res.locals.pageVariables.missingConfEmail = true;
            if(req.body.pwd) res.locals.pageVariables.pwd = req.body.pwd;
            if(!req.body.pwd) res.locals.pageVariables.missingPwd = true;
            if(req.body.confPwd) res.locals.pageVariables.confPwd = req.body.confPwd;
            if(!req.body.confPwd) res.locals.pageVariables.missingConfPwd = true;

            if(err.errorInfo === "INVALID INFORMATIONS") {
                res.locals.pageVariables.error = "Les champs obligatoires doivent être renseignés";

            } else if (err.errorInfo === "Email does not match") {
                res.locals.pageVariables.error = "Les emails ne correspondent pas";
                res.locals.pageVariables.missingEmail = true;
                res.locals.pageVariables.missingConfEmail = true;

            } else if (err.errorInfo === "Password does not match") {
                res.locals.pageVariables.error = "Les mots de passe ne correspondent pas";
                res.locals.pageVariables.missingPwd = true;
                res.locals.pageVariables.missingConfPwd = true;
            } else if (err.errorInfo === "MAIL OR PSEUDO ALREADY USED") {
                res.locals.pageVariables.error = "pseudo ou mail déjà utilisé";
                res.locals.pageVariables.missingPseudo = true;
                res.locals.pageVariables.missingEmail = true;
            } else {
                res.locals.pageVariables.error = "Une erreur est survenue. Veuillez réessayer.";
            }
            return res.render('inscription',res.locals.pageVariables);
        });
});


module.exports = router;