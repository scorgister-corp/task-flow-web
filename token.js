const request = require('./request')

class Auth {

    constructor(baseURL) {
        this.baseURL = baseURL;
    }
    
    isValidToken(token, callback) {
        
        request.sendGet(this.baseURL + "/auth", token, (success, result) => {
            if(!success) {
                callback(false);
                return;
            }

            callback(result["valid"] === true);
        });
    } 
    
}

function createAuth(baseURL) {
    return new Auth(baseURL);
}

module.exports = createAuth;
