const express = require("express")
const bcrypt = require("../utils/bcrypt")
const router = express.Router()
const db = require('../models')

/*
    Get routes
*/

router.get("/account", async (req, res, next) => {

  res.format({

    html: () => {
      res.render('user/show', {
        session: req.session,
        user: req.user,
        title: "Account"
      })
    },

    json: () => {
      // User information without password
      let userJson = req.user
      delete userJson.password
      res.json(userJson)
    }
  })
})

router.get("/account/edit", async (req, res, next) => {

  res.render("user/form", {
    session: req.session,
    user: req.user,
    title: "Edit account",
    isNew: false
  })
})

router.get("/logout", async (req, res, next) => {

  try {

    const result = await db.Session.destroy({
      where: {
        id: req.session.id
      }
    }) ? {
      status: "success"
    } : {
      status: "failure"
    }

    res.format({

      html: () => {
        res.clearCookie('AccessToken')
        res.redirect('/login')
      },

      json: () => {
        res.removeHeader('X-AccessToken')
        res.json(result)
      }
    })

  } catch (Err) {
    next(Err)
  }
})

/*
    Patch routes
*/

router.patch("/account", async (req, res, next) => {

  try {

    let changes = {}
    let where = {
      where: {
        id: req.user.id
      }
    }

    if (req.body.username) {
      const alreadyTaken = await db.User.findOne({
        where: {
          username: req.body.username
        }
      })

      if (alreadyTaken && req.body.username !== req.user.username) {
        throw new Error("Username already taken")
      }
      changes.username = req.body.username
    }

    if (req.body.firstname) {
      changes.firstname = req.body.firstname
    }

    if (req.body.lastname) {
      changes.lastname = req.body.lastname
    }

    if (req.body.password && req.body.confirmPassword) {

      if (req.body.password === req.body.confirmPassword) {
        changes.password = await bcrypt.hash(req.body.password)
      } else {
        throw new Error("Password does not match the confirm password")
      }
    }

    const result = await db.User.update(changes, where) ? {
      status: "success"
    } : {
      status: "failure"
    }

    res.format({
      html: () => {
        res.redirect('/account')
      },

      json: () => {
        res.json(result)
      }
    })

  } catch (Err) {
    next(Err)
  }
})

/*
    Delete routes
*/

router.delete("/account", async (req, res, next) => {

  try {

    await db.Session.destroy({
      where: {
        accessToken: req.session.accessToken
      }
    })

    const result = await db.User.destroy({
      where: {
        id: req.user.id
      }
    }) ? {
      status: "success"
    } : {
      status: "failure"
    }

    res.format({

      html: () => {
        res.clearCookie('AccessToken')
        res.redirect('/login')
      },

      json: () => {
        res.removeHeader('X-AccessToken')
        res.json(result)
      }
    })

  } catch (Err) {
    next(Err)
  }
})


module.exports = router