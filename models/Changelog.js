/**
 * Created by vince on 23/06/2017.
 */
'use strict';

const fs = require('fs');
const content = fs.readFileSync('./private/conf.json');
const conf = JSON.parse(content)['db'];
var Sequelize = require('sequelize');
var db = new Sequelize(conf.database, conf.user, conf.password,{
    "host": conf.host,
    "port": conf.port
});

const model = db.define('changelog', {
        id: {
            type: Sequelize.DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: Sequelize.DataTypes.STRING
        },
        description: {
            type: Sequelize.DataTypes.STRING
        },
        version: {
            type: Sequelize.DataTypes.FLOAT
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
                result.title = this.title;
                result.description = this.description;
                result.version = this.version;

                return result;
            }
        }
    });

model.sync({force : true});

module.exports = {
    "getChangelog":function(offset){
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
    "getChangelogByFilter":function(filter){
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
    "addChangelog":function(changelog) {
        return new Promise((resolve,reject) => {
            model.create(changelog)
                .then((elem) => {
                    resolve(elem);
                }).catch((err) => {
                reject(err)
            })
        })
    },
    'model': model
};