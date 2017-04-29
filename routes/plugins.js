var express = require('express');
var router = express.Router();
var pluginModel = require('../models/Plugins');
var userModel = require('../models/Users');

/* GET users listing. */
router.get('/', function(req, res, next) {
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

router.get('/:id', function(req, res, next) {
    let id = req.params.id;
    pluginModel.getPluginByFilter({
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
        .catch((err)=>{
            next(err);
        })
});

//ajout plugin a la liste des plugins de l'utilisateur <:id> TODO: gestion des fichiers sources
router.post('/users/:id/plugins/', function(req, res, next) {
    userId = req.params.id;
    name = req.body.name;
    version = req.body.version;
    description = req.body.description;
    dependencies = req.body.dependencies;

    if(!userId || !name || !version || !description || !dependencies){
        return res.status(400).json({
            error: true,
            errorInfo: "INVALID INFORMATIONS"
        })
    }
    userModel.getUserByFilter({
        'id': userId
    })
        .then((elem)=>{
            if (elem.length > 0){
                //utilisateur existant
                pluginModel.addPlugin(userId, name, version, description, sourceFile,dependencies)
            }else{
                //id ne correspond a rien
                return res.status(404).json({
                    error: true,
                    errorInfo: "NOT FOUND"
                })
            }
        })
        .catch((err)=>{
            next(err);
        })
});



module.exports = router;
