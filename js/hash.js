const sha256 = require("js-sha256")
var hash = sha256.create()


function makeHash(input) {
    hash.update(input)
    return hash.hex()
};

module.exports = makeHash