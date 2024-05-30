const http = require("http");
const mime = require("mime");
const fs = require("fs");
const Handler = require("./handler");
const token = require("./token");

const auth = token("https://api.taskflow.scorgister.net", 5);
//const auth = token("http://localhost:8000", 5);

var beta = false;

const requestListener = function(req, res) {
    const method = req.method;
    const endPoint = req.url

    const handler = Handler.getHandler(endPoint);
    if(handler == undefined) {
        res.statusCode = 404;
        res.end();
        return;
    }

    handler._doSomething(req, res, method, auth);
    
}
function start(host, port, isBeta=false) {
    beta = isBeta;
    const server = http.createServer(requestListener)
    server.listen(port, host, () => {
        console.log(`Server listening on http://${host}:${port}`);
    });
}

class APIHandler extends Handler {
    constructor(name, tokenable) {
        super("/api/" + name, tokenable);
    }

    send500(res) {
        this.send(res, {"error": true, "code": 500, "message": "Internal Server Error"}, 500)
    }

    send405(res) {
        this.send(res, {"error": true, "code": 405, "message": "Method Not Allowed"}, 405)
    }

    send401(res) {
        this.send(res, {"error": true, "code": 401, "message": "Unauthorized"}, 401)
    }

    send404(res) {
        this.send(res, {"error": true, "code": 404, "message": "Not Found"}, 404)
    }
}

class WWWHandler extends Handler {
    /**
     * betaBannerPath is relative to defaultRep
     * @param {String} endPoint 
     * @param {Boolean} tokenable 
     * @param {String} defaultRep 
     * @param {String} betaBannerPath 
     */
    constructor(endPoint, tokenable, defaultRep = "./www/", betaBannerPath = "../beta-banner.html") {
        super(endPoint, tokenable);
        this.defaultRep = defaultRep;
        if(fs.existsSync(defaultRep + betaBannerPath))
            this.betaBanner = fs.readFileSync(defaultRep + betaBannerPath);
        else
            this.betaBanner = "";
    }

    doGet(req, res) {
        var endPoint = req.url.substring(this.endPoint.length);
        if(endPoint == "")
            endPoint = "index.html";

        endPoint = endPoint.split("?")[0];
    
        try {
            this.sendFile(res, endPoint);
            return;
        }catch(e) {
            this.send404(res);
            return;
        }
    }

    doPost(req, res) {
        this.doGet(req, res);
    }

    send404(res) {
        try {
            this.sendFile(res, "404.html", 404);
        }catch(e) {
            this.send(res, undefined, 500, "text/plain");

        }
    }

    send401(res) {
        try {
            this.sendFile(res, "401.html", 401);
        }catch(e) {
            this.send(res, undefined, 500, "text/plain");
        }
    }

    sendFile(res, filePath, statusCode = 200) {
        try {
            var bufferFile = fs.readFileSync(this.defaultRep + filePath);
            var mimeType = mime.getType(filePath);

            if(beta && mimeType == "text/html") {
                var a = "";
                var b = "";
                if(bufferFile.toString().indexOf("<body>") > 0) {
                    var bufStrSplit =  bufferFile.toString().split("<body>");
                    a = bufStrSplit[0];
                    b = "";
                    
                    for(var i = 1; i < bufStrSplit.length; i++)
                        b += "<body>" + bufStrSplit[i];
                }else
                    b = bufferFile.toString();
                
                bufferFile = a + this.betaBanner + b;
            }

            this.send(res, bufferFile, statusCode, mimeType, true);
        }catch(e) {
            this.send404(res);
        }
    }

}

module.exports.start = start;
module.exports.APIHandler = APIHandler;
module.exports.WWWHandler = WWWHandler;