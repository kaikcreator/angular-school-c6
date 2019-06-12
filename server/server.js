// custom JSON-placeholder server
const path = require('path');
const jsonServer = require('json-server');
const isAuthorized = require('./auth');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
//custom auth logic
server.use((req, res, next) => {
  if (isAuthorized(req)) {
    next(); // continue to JSON Server router
  } else {
    res.sendStatus(401);
  }
});
server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running')
});