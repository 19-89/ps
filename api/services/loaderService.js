var ldr = require("./../../lib/loader");

var loader;

module.exports.load = function (groupName, url, offset, interval) {
    Groups.find()
        .where({name: groupName})
        .done(function (err, groups) {
            loader = ldr.create(url, offset, interval);
            loader.load(groups[0], 1);
        });
};