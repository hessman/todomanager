const db = require("../models")

class Session {
  /*
      Session class handles the user's session.
      check() must be used before redirect().
  */

  static async check(req, res, next) {
    /*
        Checks if there is a valid X-AccessToken in req.header or a AccessToken in req.cookies.
        Pushes some info about the session and the user into req.session and req.user.
    */
    try {

      let token
      req.session = null
      req.user = null

      res.format({

        html: () => {
          if (req.cookies.AccessToken) {
            token = req.cookies.AccessToken
          }
        },

        json: () => {
          if (req.header('X-AccessToken')) {
            token = req.header('X-AccessToken')
          }
        }
      })

      if (token) {
        const session = await db.Session.findOne({
          where: {
            accessToken: token
          }
        })

        if (session) {

          if (session.expiresAt > new Date()) {

            req.session = session.dataValues

            req.user = await db.User.findByPk(req.session.userId)

          } else {

            await db.Session.destroy({
              where: {
                accessToken: token
              }
            })

          }
        }
      }

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

      if (req.session) {

        next()

      } else {

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
      }

    } catch (Err) {
      next(Err)
    }
  }
}

module.exports = Session