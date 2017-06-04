'use strict';
module.exports = (app)=>{
    app.use(require('./Tokens'));
    app.use(require('./Users'));
    app.use(require('./PersistenceSetting'));
};