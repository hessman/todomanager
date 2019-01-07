const bcrypt = require("bcryptjs")

class Bcrypt {
  /*
      Just a promisified bcryptjs.
  */

  static hash(plaintext) {

    return new Promise((resolve, reject) => {

      bcrypt.hash(plaintext, 10, function (err, hash) {

        if (err) {
          reject(err)
        } else {
          resolve(hash)
        }
      })
    })
  }

  static compare(plaintext, hash) {

    return new Promise((resolve, reject) => {

      bcrypt.compare(plaintext, hash, function (err, res) {

        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

}

module.exports = Bcrypt