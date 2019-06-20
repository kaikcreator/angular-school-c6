const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const adapter = new FileSync(path.join(__dirname, 'db.json'));
const db = low(adapter);

//simple bearer token parser
const getBearerToken = (authHeader) => {
    if(!authHeader)
        return null;
    const authHeaderArray = authHeader.split(" ");
    if(authHeaderArray.length != 2)
        return null;
    if(!/^[Bb]earer$/.test(authHeaderArray[0]))
        return null;
    return authHeaderArray[1];
}

//function to return wether the token is in DDBB or not
const isAuthorized = (req, res, next) =>{
    if(res.locals.authenticated){
        next();
        return;
    }
    try{
        db.read();
        const token = getBearerToken(req.headers.authorization);
        //if no token is received, return forbidden status
        if (!token){
            res.sendStatus(401);
        }
        else{
            const user = db.get('users')
            .filter({token})
            .value();
            //if token belongs to some user, move forward
            if(user.length > 0){
                res.locals.authenticated = true;
                next();
            }
            //otherwise, return forbidden status
            else{
                res.sendStatus(401);
            }
        }
    }catch(err){
        //if there's some other error, return server error status
        res.sendStatus(500);
    }
};

const createUser = (req, res, next) =>{
    //if some field is missing, return a 'bad request' status
    if(!req.body.name || !req.body.email)
        res.sendStatus(400);
    //if the required fields are included, add random token and create user
    req.body.token = Math.random().toString(36).substring(2, 15);
    //mark it as authenticated, to prevent 403 error
    res.locals.authenticated = true;
    //move forward
    next();
}

module.exports = {
    isAuthorized: isAuthorized,
    createUser: createUser
}




