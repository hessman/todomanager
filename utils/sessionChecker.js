const db = require("../models")

class SessionChecker {

  static async active(req, res, next) {

    try {
      let token

      res.format({

        html: () => {
          if (req.cookies.AccessToken === undefined) {
            console.log("No cookie...")
            res.redirect('/login')
            return
          }
          token = req.cookies.AccessToken
        },

        json: () => {
          if (req.header('X-AccessToken') === undefined) {
            console.log("No X-AccessToken...")
            throw new Error("Missing X-AccessToken")
          }
          token = req.header('X-AccessToken')
        }
      })

      if (!token || token === null) {
        return
      }

      let session = await db.Session.findOne({
        where: {
          accessToken: token
        }
      })

      if (session === null) {
        console.log("Invalid session...")
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
        return
      }

      session = session.dataValues

      if (session.expiresAt < new Date()) {
        console.log("accessToken too old...")
        await db.Session.destroy({
          where: {
            accessToken: token
          }
        })
        res.format({

          html: () => {
            res.clearCookie('accessToken')
            res.redirect('/login')
          },

          json: () => {
            res.removeHeader('X-AccessToken')
            throw new Error("X-AccessToken too old")
          }
        })
        return
      }

      req.session = session
      next()

    } catch (Err) {
      next(Err)
    }
  }

  static async passive(req, res, next) {
    try {
      let isConnected = false
      let firstname

      if (req.cookies.AccessToken !== undefined) {
        let session = await db.Session.findOne({
          where: {
            accessToken: req.cookies.AccessToken
          }
        })

        if (session !== null) {
          session = session.dataValues

          if (session.expiresAt > new Date()) {
            isConnected = true
            const user = await db.User.findOne({
              where: {
                id: session.userId
              }
            })
            firstname = user.dataValues.firstname
          }
        }
      }
      req.info = {}
      req.info.isConnected = isConnected
      req.info.firstname = firstname
      next()

    } catch (Err) {
      next(Err)
    }
  }
}

  module.exports = SessionChecker