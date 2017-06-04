/**
 * Created by vince on 23/05/2017.
 */
const express = require('express');
const router = express.Router();
const moduleUser = require('../../private/modules/Users');

/**
 * Affiche la page de connexion
 */
router.get('/',function (req, res, next) {
    res.render('connection',res.locals.pageVariables);
});

/**
 * Connexion d'un utilisateur
 */
router.post('/',function (req, res, next) {
    moduleUser.connection(req.body.email, req.body.pwd)
        .then((result)=>{

            req.session.user = result.user;
            req.session.firstConnection = true;
            res.redirect('/');
        })
        .catch((err)=>{

            // Renvoie les données sur les champs complétés ou met le nom du champ en rouge
            if(req.body.email)  res.locals.pageVariables.email = req.body.email;
            if(!req.body.email)  res.locals.pageVariables.missingEmail = true;
            if(!req.body.pwd)  res.locals.pageVariables.missingPwd = true;

            if(err.errorInfo === "BAD PASSWORD OR MAIL") {
                 res.locals.pageVariables.error = "Email ou mot de passe incorrect. Veuillez réessayer.";
                 res.locals.pageVariables.missingEmail  = true;
                 res.locals.pageVariables.missingPwd = true;

            } else if(err.errorInfo === "INVALID INFORMATIONS") {
                 res.locals.pageVariables.error = "Tous les champs doivent être renseignés.";

            } else {
                 res.locals.pageVariables.error = "Une erreur est survenue. Veuillez réessayer.";
            }
            return res.render('connection', res.locals.pageVariables);
        });
});


module.exports = router;