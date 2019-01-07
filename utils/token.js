const crypto = require("crypto")

class Token {
  /*
      Token class handles the token generation.
  */

  static getRandom() {

    return new Promise((resolve, reject) => {

      crypto.randomBytes(48, function (err, buffer) {

        if (err) {
          reject(err)
        } else {
          resolve(buffer.toString("hex"))
        }
      })
    })

  }
}

module.exports = Token