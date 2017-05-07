module.exports = (app)=>{
  app.use('/api/users', require('./users'));
  app.use('/api',require('./plugins'));
  app.use('/test',require('./test'))
};
