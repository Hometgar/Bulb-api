/**
 * Created by vince on 04/06/2017.
 */

const express = require('express');
const router = express.Router();

router.get('/',function (req, res, next) {
    req.session.logout = true;
    res.redirect('/');

});

module.exports = router;

