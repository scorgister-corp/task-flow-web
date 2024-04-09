const srv = require("./server");

new srv.WWWHandler("/", false, "./www/root/");

module.exports.start = srv.start;