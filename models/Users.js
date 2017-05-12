'use strict';

const fs = require('fs');
const content = fs.readFileSync('./private/conf.json');
const conf = JSON.parse(content)['db'];
var Sequelize = require('sequelize');
var db = new Sequelize(conf.database, conf.user, conf.password,{
    "host": conf.host,
    "port": conf.port
});

const model = db.define('user', {
        id: {
            type: Sequelize.DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        pseudo: {
            type: Sequelize.DataTypes.STRING
        },
        mail: {
            type: Sequelize.DataTypes.STRING
        },
        password: {
            type: Sequelize.DataTypes.STRING
        },
    },
    {
        paranoid: true,
        underscored: true,
        freezeTableName: true,
        classMethods: {
            associate: function (models) {

                // associations can be defined here
            }
        },
        instanceMethods: {
            responsify: function () {
                let result = {};
                result.id = this.id;
                result.pseudo = this.pseudo;
                result.mail = this.mail;
                result.password = this.password;

                return result;
            }
        }
    });

model.sync();

module.exports = {
    "getUsers":function(offset){
        return new Promise((resolve, reject)=>{
            model.findAll({limit: 20, offset: (offset)?parseInt(offset):0})
                .then((elem)=>{
                    resolve(elem);
                })
                .catch((err)=>{
                    reject(err);
                })
        })
    },
    "getUserByFilter":function(filter){
        return new Promise((resolve, reject)=>{
            model.findAll({
                where: filter
            })
                .then((elem)=>{
                    resolve(elem);
                })
                .catch((err)=>{
                    reject(err);
                })
        })
    },
    "addUser":function(user) {
        return new Promise((resolve,reject) => {
            model.create(user)
                .then((elem) => {
                    resolve(elem);
                }).catch((err) => {
                reject(err)
            })
        })
    },
    'model': model
};