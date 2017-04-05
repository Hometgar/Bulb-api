module.exports = (app)=>{
    app.use(require('./Tokens'));
};

//var token = require('./Tokens');

/*console.log(token);

token.generateToken('web').then((token)=>{
    "use strict";
    console.log(token);
});*/