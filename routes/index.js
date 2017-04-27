module.exports = (app)=>{
  app.use('/api/users', require('./api/users'));
  app.use('/',require('./site/home'));
  app.use('/changelog',require('./site/changelog'));
  app.use('/plugins',require('./site/plugins'))
};
