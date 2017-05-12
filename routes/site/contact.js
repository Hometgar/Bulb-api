/**
 * Created by vince on 29/04/2017.
 */

var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();
const fs = require('fs');
const content = fs.readFileSync('./private/conf.json');
const conf = JSON.parse(content)['mail'];



/**
 * Affiche la page de contact
 */
router.get('/',function (req, res, next) {
    res.render('contacts',{title : 'contact'});
});

/**
 * Envoie les info du contact par mail.
 */
router.post('/',function (req, res, next) {

    let variables = {
        title : 'Contact'
    };

    variables.noMessage = req.body.message.trim().length == 0;
    variables.noMail = req.body.email.trim().length == 0;

    variables.message = req.body.message;
    variables.first_name = req.body.first_name;
    variables.last_name = req.body.last_name;
    variables.email = req.body.email;

    if(variables.noMail || variables.noMessage) {
        return res.render('contacts',variables);
    }


    let smtpConfig = {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // upgrade later with STARTTLS
        auth: {
            user: conf.user,
            pass: conf.mdp
        }
    };

    let transporter = nodemailer.createTransport(smtpConfig);

    transporter.verify(function(error, success) {

        if (error) {
            console.log(error);
            errorSend(res,variables);
        } else {

            var mail = {
                from: 'contact.bulb.team@gmail.com',
                to: 'contact.bulb.team@gmail.com',
                subject: 'Contact: ['+req.body.email+']['+req.body.first_name+']',
                html: 'PRENOM : '+req.body.first_name+'<br>'
                    +'NOM : '+req.body.last_name+'<br>'
                    +'<br>'
                    +'Email : '+req.body.email+'<br>'
                    +'<br>'
                    +'Msg : '+req.body.message+'<br>'
            };

            transporter.sendMail(mail, function(error, response){
                if(error){
                    console.log('Erreur lors de l\'envoie du mail!');
                    console.log(error);
                    transporter.close();
                    errorSend(res,variables);
                }else{
                    console.log('Mail envoyé avec succès!')
                    transporter.close();
                    return res.render('contacts',{
                        sended : "Votre message a bien été envoyé, Merci :) !",
                        title : variables.title
                    });
                }

            });
        }
    });

});

function errorSend(res,variables) {
    variables.noSendedError = "Une erreur est survenue lors de l'envoie du mail :( Veuillez réessayer";
    return res.render('contacts',variables);
}


module.exports = router;