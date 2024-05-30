const request = require('./request')

class Auth {

    constructor(baseURL, maxRetry) {
        this.baseURL = baseURL;
        if(maxRetry == undefined)
            this.maxRetry = 5;
        else
            this.maxRetry = maxRetry;
    }
    
    isValidToken(token, callback, count) {
        if(count == undefined)
            count = 0;

        request.sendGet(this.baseURL + "/auth", token, (success, result) => {
            if(!success && count < this.maxRetry) {
                count += 1
                this.isValidToken(token, callback, count);
                return;
            }else if(!success) {
                callback(false);
                return;
            }

            callback(result["valid"] === true);
        });
    } 
    
}

function createAuth(baseURL, maxRetry) {
    return new Auth(baseURL, maxRetry);
}

module.exports = createAuth;
