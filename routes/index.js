module.exports = (app)=>{
  app.use('/api/users', require('./api/users'));
  app.use('/api/changelog', require('./api/changelog'));
  app.use('/',require('./site/home'));
  app.use('/changelog',require('./site/changelog'));
  app.use('/plugins',require('./site/plugins'));
  app.use('/contact',require('./site/contact'));
  app.use('/inscription',require('./site/inscription'));
  app.use('/connection',require('./site/connection'));
  app.use('/logout',require('./site/logout'));
};
