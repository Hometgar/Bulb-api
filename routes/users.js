var express = require('express');
var router = express.Router();
var model = require('../models/Users');

var bcrypt = require('bcrypt');
const saltRounds = 10;

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

router.post('/', function(req, res, next) {
    console.log(req.body);
    pseudo = req.body.pseudo;
    email = req.body.email;
    verifyEmail = req.body.verifyEmail;
    password = req.body.password;
    verifyPassword = req.body.verifyPassword;

    if(!pseudo || !email || !verifyEmail || !password){
        return res.status(400).json({
            error: true,
            errorInfo: "INVALID INFORMATIONS"
        })
    }
    if(email != verifyEmail) {
        return res.status(400).json({
            error: true,
            errorInfo: "Email does not match"
        })
    }
    if(password != verifyPassword){
        return res.status(400).json({
            error: true,
            errorInfo: "Password does not match"
        })
    }

    model.getUserByFilter({
        $or: [
            {
                pseudo: pseudo
            },{
                mail: email
            }
        ]})
        .then((elem)=>{
            if (elem.length > 0){
                return res.status(409).json({
                    error: true,
                    errorInfo: "MAIL OR PSEUDO ALREADY USED"
                })
            }else{
                bcrypt.hash(password,saltRounds).then((hash) => {
                    model.addUser({
                        pseudo : pseudo,
                        mail : email,
                        password : hash
                    }).then((elem) => {
                        return res.status(201).json({
                            error : false,
                            users_id : elem.id
                        })
                    })
                })
            }
        })
        .catch((err)=>{
            next(err);
        })
});



module.exports = router;
