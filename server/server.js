// custom JSON-placeholder server
const path = require('path');
const express = require('express');
const jsonServer = require('json-server');
const isAuthorized = require('./auth');
const multer = require('multer');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const staticDir = path.join(__dirname, 'public');
const middlewares = jsonServer.defaults();
const upload = multer({ dest: 'server/public/img' });

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(express.static(staticDir));

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
    next();
    //res.sendStatus(401);
  }
});

//update contact creation to use default user image from server if no image provided
server.post('/contacts', function (req, res, next) {
  if(!req.body.picture || req.body.picture == "")
    req.body.picture = `http://localhost:3000/img/default-user.png`;
  next();
});

//update contact with image file, if provided
server.patch('/contacts/:id', upload.single('picture'), function (req, res, next) {
  if(req.file)
    req.body.picture = `http://localhost:3000/img/${req.file.filename}`;
  next();
});

//process CRUD ops on route resource based on db structure
server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running')
});