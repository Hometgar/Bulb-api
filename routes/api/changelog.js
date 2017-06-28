/**
 * Created by vince on 23/06/2017.
 */
const express = require('express');
const router = express.Router();
const modelChangelog = require('../../private/modules/Changelog');


/**
 * Affiche la liste des changelog
 */
router.get('/', function(req, res, next) {
    let offset = req.query.offset;
    console.log(offset);
    modelChangelog.getChangelog(offset)
        .then((elem)=>{
            res.json(elem);
        })
        .catch((err)=>{
            next(err);
        })
});

router.get('/:version', function(req, res, next) {
    console.log(req.params.version);
    let version = req.params.version;
    modelChangelog.getChangelogByFilter({
        version: parseFloat(version)
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
        .catch((err)=> {
            next(err);
        })
});

/**
 *  Ajout d'un changelog
 */
router.post('/', function(req, res, next) {

    modelChangelog.addChangelog({
        title : "Encore rfkrgkjfkgjfkgkjfkgfkgjfkg",
        description : "fkhgjfgkhjdfgkghjdtkjg",
        version : 1.3
    }).then((elem) => {
       return res.json(elem);
    }).catch((err) => {
        next(err);
    });

});

module.exports = router;