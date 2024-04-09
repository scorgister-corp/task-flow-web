const srv = require("./server");

new srv.WWWHandler("/", true, "./www/root/");

module.exports.start = srv.start;