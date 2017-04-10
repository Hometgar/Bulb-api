'use strict';

const bcrypt = require('bcrypt');
let collection;
const fs = require('fs');
const path = require('path');

//tableau de tokens applicatif
var applicatifKey = [];


//tableau de tokens utilisateur
var userKey = [];

//met a jour le tableau de tokens a chaque accés au fichier
const readableApplicatifStream = fs.createReadStream(path.dirname(__filename)+'/valide-key.json');
readableApplicatifStream.setEncoding('utf-8');
readableApplicatifStream.on('data',(data)=>{
    applicatifKey = JSON.parse(data);
});

const content = fs.readFileSync('./private/conf.json');

module.exports = {
    /**
     *
     * @param String client designe la plateforme pour laquelle créer la nouvelle clé
     * @returns {Promise}
     */
    "generateApplicativeToken":function (client) {
        return new Promise((resolve, reject)=>{

            var token = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for( var i=0; i < 10; i++ )
                token += possible.charAt(Math.floor(Math.random() * possible.length));


            bcrypt.genSalt(null, function(err, salt) {
                if (err){
                    throw err;
                    return reject(err);
                }
                bcrypt.hash(token, salt, function(err, hash) {
                    if (err){
                        throw err;
                        return reject(err);
                    }

                    if(!applicatifKey[client]){
                        applicatifKey[client] = [];
                    }
                    applicatifKey[client].push(hash);

                    fs.writeFileSync('./private/valide-key.json',JSON.stringify(applicatifKey));

                    return resolve(token);
                });
            });
        });
    },
    /**
     * Verify que les requetes comporte bien les tokens applicatifs et que ceux ci soit bon
     *
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    "verifyApplicatifToken":function(req, res, next){
        let token = (req.method === 'GET')? req.query.applicatifToken : req.body.applicatifToken;

        if(!token){
            return res.status(403).json({
                error: true,
                errorInfo:"INVALID TOKEN"
            })
        }
        console.log("token :"+token);

        var flag = false;
        for (var client of applicatifKey){
            for(var key of client){
                if(bcrypt.compareSync(key, token)){
                    flag = true;
                    return next();
                }
            }
            if(flag){
                break;
            }
        }

        return res.status(403).json({
            error: true,
            errorInfo:"INVALID TOKEN"
        })
    },
    /**
     *
     * @returns {Promise}
     */
    "generateUsersToken":function () {
        return new Promise((resolve, reject)=>{

            var token = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for( var i=0; i < 10; i++ )
                token += possible.charAt(Math.floor(Math.random() * possible.length));


            bcrypt.genSalt(null, function(err, salt) {
                if (err){
                    throw err;
                    return reject(err);
                }
                bcrypt.hash(token, salt, function(err, hash) {
                    if (err){
                        throw err;
                        return reject(err);
                    }

                    console.log(hash);

                    userKey.push(token);

                    return resolve(hash);

                });
            });
        });
    },
    /**
     * Delete user token
     *
     * @returns {Promise}
     */
    "deleteUsersToken":function (token) {
    return new Promise((resolve, reject)=>{

        if(!token){
            return reject(new Error("pas de token"));
        }

        var flag = false;
        for (var key of userKey){

            if(bcrypt.compareSync(key, token)){
                flag = true;
                userKey.splice(userKey[userKey.indexOf(key)],1);
                console.log(userKey);
                return resolve();
            }

            if(flag){
                break;
            }
        }


        if(!flag){
            return reject(new Error("token incorrecte"));
        }
    });
},
    /**
     * Verify que les requetes comporte bien les tokens applicatifs et que ceux ci soit bon
     *
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    "verifyUsersToken":function(req, res, next){
        let token = (req.method === 'GET')? req.query.userToken : req.body.userToken;

        if(!token){
            return res.status(403).json({
                error: true,
                errorInfo:"INVALID TOKEN"
            })
        }

        var flag = false;
        for (var key of userKey){

            if(bcrypt.compareSync(key, token)){
                flag = true;
                return next();
            }

            if(flag){
                break;
            }
        }

        return res.status(403).json({
            error: true,
            errorInfo:"INVALID TOKEN"
        })
    }
};