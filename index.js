const taskFlowSrv = require("./tf");

const args = process.argv;

const host = "::";
const port = 8100;

var isBeta = false;
if(args.length > 2)
    isBeta = args[2]=="true"?true:false;

taskFlowSrv.start(host, port, isBeta);