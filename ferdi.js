const api = require("./server");
const datas = require("./datas");
const ferdiRickroll = require("./ferdi_rickroll");
const auth = require("./auth");

base = datas.load();

function genRetJSON(indexs) {
    if(indexs.length == 0) {
        return [{"error": 404}, 404, "text/plain"];
    }
    
    var pack = [];
    for(var i = 0; i < indexs.length; i++) {
        var stu = {};
        const dat = base.getStudentInfo(indexs[i]);
        
        stu["first_name"] = dat["first_name"];
        stu["last_name"] = dat["last_name"];
        stu["class"] = dat["structure_code"];
        stu["id"] = indexs[i];
        stu["photo_id"] = dat["host_id"];
        pack.push(stu);
    }
    return [pack];
}

function isEquals(datas, txts, strict=false) {
    if(strict) {
        for(var j = 0; j < txts.length; j++) {
            if(datas.toUpperCase() == txts[j].toUpperCase()) {
                return true;
            }
        }
    }else {
        for(var i = 0; i < datas.length; i++) {
            for(var j = 0; j < txts.length; j++) {
                if(datas[i].toUpperCase() == txts[j].toUpperCase()) {
                    return true;
                }
            }
        }
    }
    return false;
}

function cleanList(L) {
    var ret = [];

    L.forEach((elt) => {
        if(!ret.includes(elt))
            ret.push(elt);
    });

    return ret;
    
}

function testFor(baseKeys, txts, strict=false) {
    var retL = [];

    if(typeof(baseKeys) == "string")
        baseKeys = [baseKeys];

    if(typeof(txts) == "string")
        txts = [txts];

    var datas = base.datas;
    for(var i = 0; i < datas.length; i++) {
        var baseKey = "";
        for(var j = 0; j < baseKeys.length; j++) {
            baseKey += datas[i][baseKeys[j]] + " ";
        }

        while(baseKey.endsWith(" ")) {
            baseKey = baseKey.substring(0, baseKey.length - 1);
        }

        if(datas[i] != undefined && baseKey != undefined) {
            let bef = [];
            [" ", "-"].forEach((elt) => {
                if(strict) {
                    if(isEquals(baseKey, txts, strict))
                        retL.push(i);   
                    
                    bef = baseKey;
                }else {
                    var datasSplited = baseKey.split(elt);
                    if(typeof(datasSplited) == "string")
                        datasSplited = [datasSplited];
                    
                    if(datasSplited.toString() == bef.toString())
                        return;

                    if(isEquals(datasSplited, txts, strict))
                        retL.push(i);    
                    bef = datasSplited;
                }
            });
            
        }
    }

    if(typeof(retL) == "string")
        retL = [retL];

    return retL;
}

function countOccurrences(inputString, characterToCount) {
    let count = 0;
  
    for(let i = 0; i < inputString.length; i++) {
        if(inputString[i] === characterToCount) {
            count++;
        }
    }
  
    return count;
}

class DataHandler extends api.APIHandler {
    constructor() {
        super("data", true);
    }

    doGet(req, res) {
       this.send(res, base.getInfos());
    }

    doPost(req, res) {
        this.readJSONBody(req, (err, body) => {
            if(err) {
                res.statusCode = 400;
                res.end();
                return;
            }
            var bodySplited = [];
            if(countOccurrences(body["name"], '"') % 2 == 0) {
                bodySplited = body["name"].split(/ +(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                var temp = [];
                bodySplited.forEach((elt) => {
                    if(elt.startsWith('"') && elt.endsWith('"')) {
                        temp.push(elt.substring(1, elt.length - 1));
                        return;
                    }

                    temp.push(elt);
                });
                bodySplited = temp;
            }else
                bodySplited = body["name"].split(" ");

           
            var ids = testFor(["first_name", "last_name"], bodySplited, true)
            .concat(testFor(["last_name", "first_name"], bodySplited))
            .concat(testFor("first_name", bodySplited))
            .concat(testFor("last_name", bodySplited))
            .concat(testFor("birthday", bodySplited))
                        .concat(testFor("mail", bodySplited))
                        .concat(testFor("phone_number", bodySplited, true))
                        .concat(testFor("phone_number", bodySplited))
                        .concat(testFor("structure_code", bodySplited, true))
                        .concat(testFor("structure_code", bodySplited))
                        .concat(testFor("birth_place", bodySplited, true))
                        .concat(testFor("birth_place", bodySplited));
           
            ids = cleanList(ids);

            var pack = genRetJSON(ids);

            if(pack.length == 1) {
                this.send(res, pack[0]);
            }else if(pack.length > 1){
                this.send(res, pack[0], pack[1]);
            }else if(pack.length > 2) {
                this.send(res, pack[0], pack[1], pack[2]);
            }
                
        });
    }
}

class StudentHandler extends api.APIHandler {
    constructor() {
        super("student", true);
    }

    doPost(req, res) {
        this.readJSONBody(req, (err, body) => {
            if(err) {
                res.statusCode = 400;
                res.end();
                return;
            }
            var pack = gbid(body);

            if(pack.length == 1) {
                this.send(res, pack[0]);
            }else if(pack.length > 1){
                this.send(res, pack[0], pack[1]);
            }else if(pack.length > 2) {
                this.send(res, pack[0], pack[1], pack[2]);
            }
                
        });
    }
}

function gbid(body) {
    const id = body["id"];
    return [base.getStudentInfo(id)];
}

class RickRollHandler extends api.WWWHandler {
    constructor(endPoint, tokenable, defaultRep, betaBannerPath) {
        super(endPoint, tokenable, defaultRep, betaBannerPath);
    }

    doGet(req, res) {
        if(req.headers && req.headers['user-agent'] && !req.headers['user-agent'].includes('curl')) {
            super.doGet(req, res);
            return;
        }
        ferdiRickroll.start(req, res);
    } 

    doPost(req, res) {
        this.doGet(req, res);
    }
}

class TeapotHandler extends api.WWWHandler {
    constructor(endPoint, tokenable, defaultRep, betaBannerPath) {
        super(endPoint, tokenable, defaultRep, betaBannerPath);
    } 

    doPost(req, res) {
        this.doGet(req, res);
    }

    sendFile(res, filePath, statusCode = 200) {
        if(filePath.endsWith(".html")) {
            super.sendFile(res, "418.html", 418)
        }else
            super.sendFile(res, filePath, statusCode);
    }
}

new DataHandler();
new StudentHandler();
new api.WWWHandler("/ferdi/", true, "./www/ferdi/");
new api.WWWHandler("/nssh/", true, "./www/nssh/");
new TeapotHandler("/teapot/", false, "./www/teapot/");
new RickRollHandler("/", false, "./www/root/");

module.exports.start = api.start;