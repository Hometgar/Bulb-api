/**
 * Created by vince on 02/06/2017.
 */

const CSS_HOME = 'stylesheets/home.css';
const CSS_LOGIN = 'stylesheets/connection.css';
const CSS_PROPOS = 'stylesheets/propos.css';
const CSS_BOTTOM_FOOTER = 'stylesheets/bottomFooter.css';


module.exports = {

    // Renseigne le nom de la page + css
    pageSetting:function(req,res,next) {

        switch(req.url) {
            case '/' :
                res.locals.pageVariables = {
                    title : 'Home',
                    css : CSS_HOME
                };
                break;
            case '/connection' :
                res.locals.pageVariables = {
                    title : 'Connexion',
                    css : CSS_LOGIN
                };
                break;
            case '/inscription' :
                res.locals.pageVariables = {
                    title : 'Inscription'
                };
                break;
            case '/propos' :
                res.locals.pageVariables = {
                    title : 'A propos',
                    css : CSS_PROPOS
                };
                break;
            case '/contact' :
                res.locals.pageVariables = {
                    title : 'Contact',
                    css : CSS_BOTTOM_FOOTER
                };
                break;
            default :
                res.locals.pageVariables = {
                    title : 'Erreur 404'
                }


        }
        return next();
    },

    /**
     *
     * @param req
     * @param res
     * @param next
     * @description Permet la gestion de la gestion et de la transmission d'information d'une route à une autre.
     */
     sessionSetting: function (req, res, next) {

        if(req.url === '/connection' && req.session.userRegistered) {
            //bandeau de confirmation de l'inscription
            res.locals.pageVariables.userRegistered = req.session.userRegistered;
            delete req.session.userRegistered;
            console.log(res.locals.pageVariables)
        } else if(req.url === '/'){
            //bandeau de confirmation de la connexion
            if(req.session.firstConnection) {
                res.locals.pageVariables.firstConnection = true;
                delete req.session.firstConnection;
            } else if(req.session.logout) {
                //bandeau de confirmation de deconnexion
                res.locals.pageVariables.logout = true;
                delete req.session.logout;

                //Suprime la session
                delete req.session.user;
            }
        }


         req.session.user ? res.locals.pageVariables.user = req.session.user : false;

         next();
     }


};