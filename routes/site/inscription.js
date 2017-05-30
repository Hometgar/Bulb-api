/**
 * Created by vince on 23/05/2017.
 */
let express = require('express');
let router = express.Router();
let moduleUser = require('../../private/modules/Users');

const PAGE_TITLE = "Inscription";

/**
 * Affiche la page d'inscription
 */
router.get('/',function (req, res, next) {
    res.render('inscription',{title : PAGE_TITLE});
});

/**
 * Inscription d'un utilisateur
 */
router.post('/',function (req, res, next) {
    let params = {title : PAGE_TITLE};
    moduleUser.addUser(req.body.pseudo,req.body.firstName,req.body.lastName,
                        req.body.email,req.body.confEmail,req.body.pwd,req.body.confPwd)
        .then((user)=>{
            console.log('then test');
            console.log(user);
        })
        .catch((err)=>{

            // Renvoie les données sur les champs complétés ou met le nom du champ en rouge
            if(req.body.pseudo) params.pseudo = req.body.pseudo;
            if(!req.body.pseudo) params.missingPseudo = true;
            if(req.body.email) params.email = req.body.email;
            if(!req.body.email) params.missingEmail = true;
            if(req.body.confEmail) params.confEmail = req.body.confEmail;
            if(!req.body.confEmail) params.missingConfEmail = true;
            if(req.body.pwd) params.pwd = req.body.pwd;
            if(!req.body.pwd) params.missingPwd = true;
            if(req.body.confPwd) params.confPwd = req.body.confPwd;
            if(!req.body.confPwd) params.missingConfPwd = true;

            if(err.errorInfo === "INVALID INFORMATIONS") {
                params.error = "Les champs obligatoires doivent être renseignés";

            } else if (err.errorInfo === "Email does not match") {
                params.error = "Les emails ne correspondent pas";
                params.missingEmail = true;
                params.missingConfEmail = true;

            } else if (err.errorInfo === "Password does not match") {
                params.error = "Les mots de passe ne correspondent pas";
                params.missingPwd = true;
                params.missingConfPwd = true;
            } else if (err.errorInfo === "MAIL OR PSEUDO ALREADY USED") {
                params.error = "pseudo ou mail déjà utilisé";
                params.missingPseudo = true;
                params.missingEmail = true;
            } else {
                params.error = "Une erreur est survenue. Veuillez réessayer.";
            }
            return res.render('inscription',params);
        });
});


module.exports = router;