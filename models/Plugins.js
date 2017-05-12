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

const pluginModel = db.define('plugin', {
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
        name:{
            singular: 'plugin',
            plural: 'plugins'
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

pluginModel.belongsToMany(pluginModel,{through: 'PluginDependencies', as:'PluginDependencies'});
pluginModel.belongsTo(userModel);

db.sync();

module.exports = {
    "getPlugins":function(offset){
        return new Promise((resolve, reject)=>{
            pluginModel.findAll({limit: 20, offset: (offset)?parseInt(offset):0})
                .then((elem)=>{
                    resolve(elem);
                })
                .catch((err)=>{
                    reject(err);
                })
        })
    },
    "getPluginByFilter":function(filters){
        return new Promise((resolve, reject)=>{
            pluginModel.findAll(filters)
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
     * @param dependencies
     * @returns {Promise}
     */
    "addPlugin":function(userId, name, version, description, dependencies) {
        return new Promise((resolve,reject) => {
            var plugin = {};
            pluginModel.create({
                user_id: userId,
                name: name,
                version: version,
                description: description
            })
                .then((newPlugin) => {
                    plugin = newPlugin.dataValues;
                    plugin.dependencies = [];
                    var filter = [];
                    if(dependencies != null){
                        dependencies.forEach((id)=>{
                            filter.push({
                                id: id
                            });
                        });

                        pluginModel.findAll({
                            where: {
                                $or: filter
                            }
                        })
                            .then((plugins)=>{
                                plugins.forEach((pluginSource)=>{
                                    plugin.dependencies.push(pluginSource.dataValues);
                                });
                                newPlugin.setPluginDependencies(plugins)
                                    .then(()=>{
                                        resolve(plugin);
                                    })
                            })
                            .catch((err)=>{
                                reject(err);
                            })
                    }else{
                        resolve(plugin);
                    }
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },
    'model': pluginModel
};