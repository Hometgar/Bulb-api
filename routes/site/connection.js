/**
 * Created by vince on 23/05/2017.
 */
var express = require('express');
var router = express.Router();
var moduleUser = require('../../private/modules/Users');

// Titre de la page
const PAGE_TITLE = "Connexion";

/**
 * Affiche la page de connexion
 */
router.get('/',function (req, res, next) {
    res.render('connection',{title : PAGE_TITLE});
});

/**
 * Connexion d'un utilisateur
 */
router.post('/',function (req, res, next) {
    let params = {title : PAGE_TITLE};
    moduleUser.connection(req.body.email, req.body.pwd)
        .then((user)=>{
            return res.status(user.errorCode).json(user);
        })
        .catch((err)=>{

            // Renvoie les données sur les champs complétés ou met le nom du champ en rouge
            if(req.body.email) params.email = req.body.email;
            if(!req.body.email) params.missingEmail = true;
            if(!req.body.pwd) params.missingPwd = true;

            if(err.errorInfo === "BAD PASSWORD OR MAIL") {
                params.error = "Email ou mot de passe incorrect. Veuillez réessayer.";
                params.missingEmail  = true;
                params.missingPwd = true;

            } else if(err.errorInfo === "INVALID INFORMATIONS") {
                params.error = "Tous les champs doivent être renseignés.";

            } else {
                params.error = "Une erreur est survenue. Veuillez réessayer.";
            }
            return res.render('connection',params);
        });
});


module.exports = router;