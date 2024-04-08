const request = require('./request')

class Auth {

    constructor(baseURL) {
        this.baseURL = baseURL;
    }
    
    isValidUserId(token, callback) {
        const currTime = Date.now();
        
        request.sendPost(this.baseURL + "/auth")
        
        db.exists(path).then((exist) => {
            if(!exist) {
                callback(false);
                return;
            }
            db.getData(path).then((value) => {
                if(value["end"] == undefined)
                    callback(false);
                else
                    callback(currTime < value["end"]);
            });
        });
    }
    
}

module.exports.isValidUserId = isValidUserId;
