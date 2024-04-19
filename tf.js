const srv = require("./server");

new srv.WWWHandler("/taskflow/", true, "./www/taskflow/");
new srv.WWWHandler("/", false, "./www/root/");

module.exports.start = srv.start;