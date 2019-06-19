// custom JSON-placeholder server
const path = require('path');
const jsonServer = require('json-server');
const isAuthorized = require('./auth');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);
//custom auth logic
server.use((req, res, next) => {
  if (isAuthorized(req)) {
    next(); // continue to JSON Server router
  }
  //if not authorized, but creating a new user...
  else if(req.path == '/users' && req.method == 'POST'){
    if(!req.body.name || !req.body.email)
      res.sendStatus(400);
    //if there's name and email, add random token and create user
    req.body.token = Math.random().toString(36).substring(2, 15);
    next();
  } 
  else {
    res.sendStatus(401);
  }
});
server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running')
});