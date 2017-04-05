'use strict';

const bcrypt = require('bcrypt');

const fs = require('fs');

//tableau de tokens
var conf = [];

//met a jour le tableau de tokens a chaque accés au fichier
const readableStream = fs.createReadStream('./private/valide-key.json');
readableStream.setEncoding('utf-8');
readableStream.on('data',(data)=>{
    conf = JSON.parse(data);
});

const content = fs.readFileSync('./private/conf.json');

module.exports = {
    /**
     *
     * @param String client design la plateforme pour laquelle créer la nouvelle clé
     * @returns {Promise}
     */
    "generateToken":function (client) {
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

                    if(!conf[client]){
                        conf[client] = [];
                    }
                    conf[client].push(hash);

                    fs.writeFileSync('./private/valide-key.json',JSON.stringify(conf));

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

        console.log("token :"+token);

        var flag = false;
        for (var client of conf){
            for(var key of client){
                if(bcrypt.compareSync(token,key)){
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
    }
};