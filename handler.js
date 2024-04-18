var handlers = []

class Handler {

    constructor(endPoint, tokenable = true) {
        if(!endPoint.startsWith("/"))
            endPoint = "/" + endPoint;

        this.endPoint = endPoint;
        this.tokenable = tokenable;
        
        handlers.push(this);
    }

    static getHandler(endPoint) {
        endPoint = endPoint.split("?")[0];

        for(var i = 0; i < handlers.length; i++) {
            var ep = handlers[i].endPoint.toUpperCase();
            if(ep.endsWith("/") && endPoint.toUpperCase().startsWith(ep))
                return handlers[i];
            else if(!ep.endsWith("/") && endPoint.toUpperCase() == ep)
                return handlers[i];
        }

        return undefined;
    }

    #_switchProtocole(req, res, method) {
        switch(method) {
            case "POST":
                this.doPost(req, res);
                break;
                
            case "GET":
                
            default:
                this.doGet(req, res);
                break;
        }
    }

    _doSomething(req, res, method, auth) {
        if(this.tokenable) {
            var cookie = req.headers["cookie"];

            if(cookie == undefined) {
                this.send401(res);
                return;
            }
            var token = getCookie("token", cookie);
            
            if(token != undefined) {
                auth.isValidToken(token, (valid) => {
                    if(valid)
                        this.#_switchProtocole(req, res, method);
                    else
                        this.send401(res);
                });
                return;
            }
            this.send401(res);
            return;
        }

        this.#_switchProtocole(req, res, method);
    }

    send404(res) {
        this.send(res, undefined, 404, "text/plain");
    }

    send405(res) {
        this.send(res, undefined, 405, "text/plain");
    }

    send401(res) {
        this.send(res, undefined, 401, "text/plain");
    }

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    doGet(req, res) {
       this.send405(res);
    }

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    doPost(req, res) {
        this.send405(res);
    }

    /**
     * 
     * @param {*} res 
     * @param {*} message 
     * @param {int} statusCode 
     * @param {string} contentType 
     */
    send(res, message, statusCode = 200, contentType = "application/json", isWeb = false) {
        res.statusCode = statusCode;
        res.setHeader("Content-Type", contentType);
        res.setHeader("X-Robots-Tag", "noindex, nofollow");
        res.setHeader("Access-Control-Allow-Origin", "https://api.taskflow.scorgister.net");

        if(contentType == "application/json" && !isWeb)
            message = JSON.stringify(message);
        if(message == undefined)
            res.end();
        else {
            res.end(message);
        }
    }

    readBody(req, result) {
        req.on("data", (chunk) => {
            result(false, chunk.toString());
        });
    }

    /**
     * 
     * @param {*} req 
     * @param {function (boolean, JSON)} result 
     */
    readJSONBody(req, result) {
        this.readBody(req, (err, body) => {
            try {
                result(false, JSON.parse(body));
            }catch(e) {
                result(true, undefined);
            }
        });
    }

}

function getCookie(cname, cookie) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(cookie);

    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while(c.charAt(0) == ' ')
            c = c.substring(1);

        if(c.indexOf(name) == 0)
            return c.substring(name.length, c.length);
    }

    return null;
}

module.exports = Handler;