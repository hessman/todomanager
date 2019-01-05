const db = require("../models")

class Session {
  /*
      Session class handles the user's session.
      check() must be used before redirect().
  */

  static async check(req, res, next) {
    /*
        Checks if there is a valid X-AccessToken in req.header or a AccessToken in req.cookies.
        Pushes some info about the session into req.session.
    */
    try {
      let isConnected = false
      let firstname
      let token
      req.session = {}

      res.format({

        html: () => {
          if (req.cookies.AccessToken !== undefined) {
            token = req.cookies.AccessToken
          }
        },

        json: () => {
          if (req.header('X-AccessToken') !== undefined) {
            token = req.header('X-AccessToken')
          }
        }
      })

      if (token !== undefined && token !== null) {
        let session = await db.Session.findOne({
          where: {
            accessToken: token
          }
        })

        if (session !== null) {
          session = session.dataValues

          if (session.expiresAt > new Date()) {

            isConnected = true
            req.session = session

            const user = await db.User.findOne({
              where: {
                id: session.userId
              }
            })

            firstname = user.dataValues.firstnam

          } else {

            await db.Session.destroy({
              where: {
                accessToken: token
              }
            })

          }
        }
      }

      req.session.isConnected = isConnected
      req.session.firstname = firstname
      next()

    } catch (Err) {
      next(Err)
    }
  }

  static async redirect(req, res, next) {
    /*
        Handles requests with invalid session :
          - redirects to /login for html.
          - throws an error for json.
    */
    try {

      if (req.session.isConnected) {
        next()
        return
      }

      res.format({

        html: () => {
          res.clearCookie('accessToken')
          res.redirect('/login')
        },

        json: () => {
          res.removeHeader('X-AccessToken')
          throw new Error("Invalid X-AccessToken")
        }
      })
      
    } catch (Err) {
      next(Err)
    }
  }
}

module.exports = Session