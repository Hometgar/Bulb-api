'use strict';

const fs = require('fs');
const content = fs.readFileSync('./private/conf.json');
const conf = JSON.parse(content)['db'];
const userModel = require('./Users')['model'];
var Sequelize = require('sequelize');
var db = new Sequelize(conf.database, conf.user, conf.password,{
    "host": conf.host,
    "port": conf.port
});

const model = db.define('plugin', {
        id: {
            type: Sequelize.DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.DataTypes.STRING
        },
        version: {
            type: Sequelize.DataTypes.STRING
        },
        description: {
            type: Sequelize.DataTypes.STRING
        }
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
                //todo redefine

                return result;
            }

        }
    });

model.belongsToMany(model,{through: 'pluginDependencies', as:'pluginSource'});
model.belongsTo(userModel);
model.sync({
    force: true
});
module.exports = {
    "getPlugins":function(offset){
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
    "getPluginByFilter":function(filter){
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
    /**
     *
     * @param userId
     * @param name
     * @param version
     * @param description
     * @param sourceFile
     * @param dependancies
     * @returns {Promise}
     */
    "addPlugin":function(userId, name, version, description, sourceFile, dependancies) {
        return new Promise((resolve,reject) => {
            model.create({
                user_id: userId,
                name: name,
                version: version,
                description: description
            })
                .then((elem) => {
                    if(dependancies.length > 0){
                        dependancies.forEach((idSource)=>{
                            elem.addPlugin(idSource);
                        })
                    }
                    resolve(elem);
                }).catch((err) => {
                reject(err)
            })
        })
    },
    'model': model
};