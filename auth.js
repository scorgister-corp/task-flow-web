const speakeasy = require("speakeasy");
const uuid = require("uuid");
const api = require("./api");

class AuthTokenHandler extends api.APIHandler {
    constructor() {
        super("auth/token", false);
    }

    doPost(req, res) {
        this.readJSONBody(req, (err, body) => {
            if(err)
                return;

            const token = body["token"];

            if(token == undefined) {
                this.send500(req);
                return;
            }

            api.tokenRegister.db.getData("/").then((values) => {
                for(const [k, v] of Object.entries(values)) {
                    if(v["token"] != undefined && v["token"] == token) {
                        this.send(res, {error: false, registered: true, user_id: k});
                        return;
                    }
                }
                this.send(res, {error: true, registered: false});
            });

        });
    }
}

class AuthResgisterHandler extends api.APIHandler {
    constructor() {
        super("auth/register", false);
    }

    doPost(req, res) {
        this.readJSONBody(req, (err, body) => {
            if(err)
                return;

            const token = body["token"];
            const userId= body["user_id"];

            const path = api.tokenRegister.getDBPath(userId);
            
            api.tokenRegister.db.exists(path + "/temp_secret").then((value) => {
                if(!value) {
                    api.tokenRegister.db.exists(path + "/secret").then((val) => {
                        if(!val) {
                            const temp_secret = speakeasy.generateSecret({name: "ferdi project", algorithm: 'sha256'});
                            
                            api.tokenRegister.db.push(path, {userId, token, temp_secret}, true);
                            this.send(res, {user_id: userId, otp_path: temp_secret.otpauth_url});
                            return;
                        }else
                            this.send(res, {next: true});
                    });
                }else {
                    api.tokenRegister.db.getObject(path + "/temp_secret/otpauth_url").then((value) => {
                        this.send(res, {user_id: userId, otp_path: value});
                    });
                }

            });
        });
    }

}

class AuthValidateHandler extends api.APIHandler {
    constructor() {
        super("auth/validate", false);
    }

    doPost(req, res) {
        this.readJSONBody(req, (err, body) => {
            if(err)
                return;

            const userId = body["user_id"];
            const token = body["token"];
            const user = api.tokenRegister.db.getData(api.tokenRegister.getDBPath(userId));

            api.tokenRegister.db.exists(api.tokenRegister.getDBPath(userId) + "/secret").then((val) => {
                if(val) {
                    this.send(res, {next: true});
                    return;
                }

                user.then((value) => {
                    const secret = value.temp_secret.base32;
                    const verified = verify(secret, token);
                      
                    if(verified) {
                        api.tokenRegister.db.push(api.tokenRegister.getDBPath(userId), {id: userId, token: value.token, secret: value.temp_secret});
                        this.send(res, {next: true})
                    }else {
                        this.send(res, {next: false})
                    }
                });
            });
        });
    }
}

class AuthLoginHandler extends api.APIHandler {
    constructor() {
        super("auth/login", false);
    }

    doPost(req, res) {
        this.readJSONBody(req, (err, body) => {
            if(err)
                return;

            const userId = body["user_id"];
            const token = body["token"];
            const user = api.tokenRegister.db.getData(api.tokenRegister.getDBPath(userId));

            api.tokenRegister.db.exists(api.tokenRegister.getDBPath(userId) + "/secret").then((val) => {
                if(!val) {
                    this.send(res, {success: false});
                    return;
                }

                user.then((value) => {
                    const secret = value.secret.base32;
                    const verified = verify(secret, token);
                      
                    if(verified) {
                        /* durée de validité !! */
                        const durr = 30 * 60 * 1000;
                        value["end"] = Date.now() + durr;
                        api.tokenRegister.db.push(api.tokenRegister.getDBPath(userId), value, true);
                        this.send(res, {success: true});
                    }else {
                        this.send(res, {success: false});
                    }
                });
            });
        });

    }
}

class AuthLogoutHandler extends api.APIHandler {
    constructor() {
        super("auth/logout", true);
    }

    doPost(req, res) {
        this.readJSONBody(req, (err, body) => {
            if(err) {
                return;
            }

            const userId = body["user_id"];
            if(userId == undefined) {
                this.send500(res);
                return;
            }

            api.tokenRegister.logout(userId, (err) => {
                if(!err)
                    this.send(res, {success: true});
                else
                    this.send404(res);
            });
        });
    }
}

class AuthStatusHandler extends api.APIHandler {
    constructor() {
        super("auth/status", true);
    }

    doPost(req, res) {
        this.readJSONBody(req, (err, body) => {
            if(err)
                return;

            const usrId = body["user_id"];
            if(usrId == undefined) {
                this.send404(res);
                return;
            }

            api.tokenRegister.status(usrId, (result) => {
                this.send(res, result);
            });
        });
    }
}

function verify(secret, token) {
    return speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token
    });
}

new AuthTokenHandler();
new AuthResgisterHandler();
new AuthValidateHandler();
new AuthLoginHandler();
new AuthLogoutHandler();
new AuthStatusHandler();