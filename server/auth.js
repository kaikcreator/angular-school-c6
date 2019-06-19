const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const adapter = new FileSync(path.join(__dirname, 'db.json'));
const db = low(adapter);

//simple bearer token parser
const getBearerToken = (authHeader) => {
    const authHeaderArray = authHeader.split(" ");
    if(authHeaderArray.length != 2)
        return null;
    if(!/^[Bb]earer$/.test(authHeaderArray[0]))
        return null;
    return authHeaderArray[1];
}

//function to return wether the token is in DDBB or not
module.exports = isAuthorized = (request) => {
    try{
        const token = getBearerToken(request.headers.authorization);
        if (!token)
            return false;
        const user = db.get('users')
        .filter({token})
        .value();
        return user.length > 0;
    }catch(err){
        return false;
    }
}




