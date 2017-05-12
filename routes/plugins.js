var express = require('express');
var router = express.Router();
var pluginModel = require('../models/Plugins');
var userModel = require('../models/Users');
const sequelize = require('sequelize');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const uploadDestination = path.join(__dirname,'..','private','plugins-tmp');
var upload = multer({dest: uploadDestination});

/* GET users listing. */
router.get('plugins/', function(req, res, next) {
    let offset = req.query.offset;
    console.log('offset :',offset);
    pluginModel.getPlugins(offset)
        .then((elem)=>{
            res.json(elem);
        })
        .catch((err)=>{
            next(err);
        })

});

router.get('plugins/:id', function(req, res, next) {
    let id = req.params.id;
    pluginModel.getPluginByFilter({
        where:{
            id: parseInt(id)
        }
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
        .catch((err)=>{
            next(err);
        })
});

//ajout plugin a la liste des plugins de l'utilisateur <:id>
router.post('/users/:id/plugins/', upload.single('sourceFile'), function(req, res, next) {

    userId = req.body.id;
    name = req.body.name;
    version = req.body.version;
    description = req.body.description;
    dependencies = req.body.dependencies != null ? JSON.parse(req.body.dependencies) : null;
    sourceFile = req.file;

    flag = false;
    if(!userId || !name || !version || !description || !sourceFile || !sourceFile.mimetype.match('zip')){
        flag = true;
        if(sourceFile){
            //champs manquant suppression du dossier temp
            deleteFichierTemps(function(){
                return res.status(400).json({
                    error: true,
                    errorInfo: "INVALID INFORMATIONS"
                })
            });
        }
        return res.status(400).json({
            error: true,
            errorInfo: "INVALID INFORMATIONS"
        })
    }

    if(!flag) {
        userModel.getUserByFilter({
            where: {
                'id': userId
            }
        })
            .then((elem) => {
                if (elem.length > 0) {
                    //utilisateur existant
                    pluginModel.addPlugin(userId, name, version, description, dependencies)
                        .then((elem) => {
                            "use strict";

                            //chemin final du dossier plugin
                            let dest = path.join(uploadDestination, '../plugins', name, version+'.zip');

                            //verification que le dossier du plugin existe; s'il n'existe pas on le crée
                            fs.access(path.join(uploadDestination, '../plugins/',name),(err)=>{

                                if(err ? err.code === 'ENOENT' : false){
                                    console.log('fichier racine non existant');
                                    //création du dossier racine du plugin
                                    fs.mkdir(path.join(uploadDestination, '../plugins/',name),(err)=>{
                                        console.log('creation');
                                        //une erreur est survenue desengorgement du fichier temp
                                        if(err){
                                            console.log(err);
                                            deleteFichierTemps();
                                            return next(err);
                                        }

                                        lastCreation(dest, elem);
                                    })
                                }else {
                                    //le dossier existe pas besoin de le créer;
                                    lastCreation(dest, elem);
                                }
                            });
                        })
                        .catch((err) => {
                            "use strict";
                            console.log(err);
                            deleteFichierTemps();
                        })
                } else {
                    //id ne correspond a rien

                    return res.status(404).json({
                        error: true,
                        errorInfo: "NOT FOUND"
                    })
                }
            })
            .catch((err) => {
                return next(err);
            });
    }
    /**
     * création du dossier de version du plugin et deplacement du paquet temp dans le dossier final
     * @param dest
     * @elem objet plugin a renvoyer
     */
    function lastCreation(dest, elem) {
        fs.rename(sourceFile.path, dest, (err) => {
            console.log('creation dossier version');
            if (err) {
                console.log(err);
                pluginModel.destroy({where: {id: elem.id}})
                    .then((count) => {
                        if (count > 0) {
                            return next(err);
                        }
                    });
            }
            deleteFichierTemps();
            res.status(201).send(elem);
        })
    }

    /**
     * Deletion du fichier temporaire;
     */
    function deleteFichierTemps(call){
        "use strict";

        if(!call){
            call = function(err){
                "use strict";

                if(err){
                    throw err;
                }
            }
        }

        console.log('suppression fichier temp');
        fs.access(sourceFile.path,(err)=>{
            if(!err){
                fs.unlink(sourceFile.path, call);
            }
        })
    }
});

router.get('/users/:id/plugins',(req,res,next)=>{
    "use strict";
    let id = req.params.id;

    userModel.getUserByFilter({
        id: id
    }).then((user)=>{
        if(user.length > 0 ){
            pluginModel.getPluginByFilter({
                attributes:[
                    'name',
                    [sequelize.fn('MAX', sequelize.col('version')), 'version'],
                    [sequelize.fn('MAX', sequelize.col('id')), 'id'],
                    'description'
                ],
                where:{
                    user_id: id
                },
                group:[
                    'name'
                ]
            }).then((plugins)=>{
                let plugRes = plugins.map((plugin)=>{
                    plugin  = plugin.dataValues;
                    return {
                        id: plugin.id,
                        name: plugin.name,
                        description: plugin.description,
                        version: plugin.version
                    }
                });
                res.status(200).json({
                    error: false,
                    plugins: plugRes ? plugRes : []
                })
            }).catch((err)=>{
                console.log(err);
                next(err);
            })
        }else{
            res.status(404).json({
                error: true,
                errorInfo: "NOT FOUND"
            });
        }
    }).catch((err)=>{
        console.log(err);
        next(err);
    })
});

module.exports = router;
