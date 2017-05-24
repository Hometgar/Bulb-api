var express = require('express');
var router = express.Router();
var model = require('../../models/Users');
var moduleUser = require('../../private/modules/Users');

/**
 *  api/users.js gère la partie utilisateur de l'api
 */

/* GET users listing. */
router.get('/', function(req, res, next) {
    let offset = req.query.offset;
    console.log(offset);
    model.getUsers(offset)
        .then((elem)=>{
            res.json(elem);
        })
        .catch((err)=>{
            next(err);
        })

});

router.get('/:id', function(req, res, next) {
    let id = req.params.id;
    model.getUserByFilter({
        id: parseInt(id)
    })
        .then((elem)=>{
            if (elem.length > 0){
                res.json(elem);
            }else{
                res.status(404).json({
                    error: true,
                    errorInfo: "NOT FOUND"
                })
            }
        })
        .catch((err)=> {
            next(err);
        })
});

/**
 *  Ajout d'un utilisateur
 */
router.post('/', function(req, res, next) {

    console.log("ajout d'un utilisateur");
    console.log(req.query);
    // moduleUser.addUser(req.body.pseudo,req.body.firstName,req.body.lastName,
    //     req.body.email,req.body.confEmail,req.body.pwd,req.body.confPwd)
    //
    //     .then((user)=>{
    //         res.status(user.errorCode).json(user);
    //     })
    //     .catch((err)=>{
    //         res.status(err.errorCode).json(err);
    //     });


});

/**
 * Connexion d'un utilisateur
 */
router.post("/connection", function (req, res, next) {

    console.log(req.body);
    moduleUser.connection(req.body.email, req.body.password)
        .then((user)=>{
            res.status(user.errorCode).json(user);
        })
        .catch((err)=>{
            res.status(user.errorCode).json(err);
        });


});



module.exports = router;
