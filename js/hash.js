const sha256 = require("js-sha256")



function makeHash(input) {
  var hash = sha256.create()
  hash.update(input)
  return hash.hex()
};

module.exports = makeHash