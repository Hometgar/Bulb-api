/**
 * Created by vince on 28/06/2017.
 */
let model = require('../../../models/Changelog');
let bcrypt = require('bcrypt');

let userModule = {
    getChangelog: (offset)=>{
        return new Promise((resolve, reject)=>{
            model.getChangelog(offset)
                .then((elem)=>{
                    return resolve(elem);
                })
                .catch((err)=>{
                    return reject(err);
                })

            })

    },

    getChangelogByFilter : (filter)=> {
        return new Promise((resolve, reject)=>{
            model.getChangelogByFilter(filter)
                .then((elem)=>{
                    return resolve(elem);
                })
                .catch((err)=>{
                    return reject(err);
                })

        })

    },
    addChangelog: (changelog) => {

        return new Promise((resolve,reject) => {

            if(!changelog.title || ! changelog.description || !changelog.version) {
                return resolve({
                    errorCode: 400,
                    error : true,
                    errorInfo : "INVALID INFORMATION"
                })
            }

            model.addChangelog(changelog).then((elem) => {
                return resolve({
                    errorCode: 201,
                    error: false,
                    changelog_id: elem.id
                });
            }).catch((err) =>{
                return reject(err);
            });

        });
    }

};

module.exports = userModule;