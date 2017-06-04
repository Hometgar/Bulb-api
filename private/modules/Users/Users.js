let model = require('../../../models/Users');
let bcrypt = require('bcrypt');
const saltRounds = 10;

let userModule = {
    connection: (email, pwd)=>{
        return new Promise((resolve, reject)=>{
            if(!email || !pwd){
                return reject({
                    errorCode : 400,
                    error: true,
                    errorInfo: "INVALID INFORMATIONS"
                });
            } else{
                model.getUserByFilter({
                    $or: [
                        {
                            pseudo: email
                        },{
                            mail: email
                        }
                    ]}).then((elem) => {
                    if(elem.length > 0){
                        let user = elem[0].dataValues;
                        bcrypt.compare(pwd,elem[0].dataValues.password).then((same) => {
                            if(same){
                                return resolve({
                                    errorCode : 200,
                                    error : false,
                                    user : user
                                })
                            }
                            else{
                                return reject({
                                    errorCode : 404,
                                    error : true,
                                    errorInfo : "BAD PASSWORD OR MAIL"
                                })
                            }
                        });
                    }else{
                        return reject({
                            errorCode : 404,
                            error : true,
                            errorInfo : "BAD PASSWORD OR MAIL"
                        });
                    }


                }).catch((err) => {
                    return reject({errorCode : 404});
                });

            }
        });

    },
    addUser: (pseudo,firstName,lastName,email,confEmail,pwd,confPwd) => {
        return new Promise((resolve, reject)=>{
            if(!pseudo || !email || !confEmail || !pwd || !confPwd){
                return reject({
                    errorCode : 400,
                    error: true,
                    errorInfo: "INVALID INFORMATIONS"
                });
            }
            if(email !== confEmail) {
                return reject({
                    errorCode : 400,
                    error: true,
                    errorInfo: "Email does not match"
                });
            }
            if(pwd !== confPwd){
                return reject({
                    errorCode : 400,
                    error: true,
                    errorInfo: "Password does not match"
                });
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
                        return reject({
                            errorCode : 409,
                            error: true,
                            errorInfo: "MAIL OR PSEUDO ALREADY USED"
                        });
                    }else{
                        bcrypt.hash(pwd,saltRounds).then((hash) => {
                            model.addUser({
                                pseudo : pseudo,
                                lastName : lastName,
                                firstName : firstName,
                                mail : email,
                                password : hash
                            }).then((elem) => {
                                return resolve({
                                    errorCode : 201,
                                    error : false,
                                    users_id : elem.id
                                });
                            });
                        });
                    }
                })
                .catch((err)=>{
                    return reject(err);
                });
        });

    }

};

module.exports = userModule;