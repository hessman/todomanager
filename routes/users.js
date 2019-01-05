const express = require("express")
const bcrypt  = require("../utils/bcrypt")
const router  = express.Router()
const db      = require('../models')

/*
    Get routes
*/

router.get("/account", async (req, res, next) => {

  try {

    let user = await db.User.findByPk(req.session.userId)
    delete user.password

    res.format({

      html: () => {
        res.render('user/show', {
          title: "Account",
          user: user,
          info: req.info
        })
      },

      json: () => {
        res.json(user)
      }
    })
  } catch (Err) {
    next(Err)
  }
})

router.get("/account/edit", async (req, res, next) => {

  try {

    let user = await db.User.findByPk(req.session.userId)
    delete user.password

    res.render("user/form", {
      title: "Edit account",
      user: user,
      info: req.info,
      isNew: false
    })
      
  } catch (Err) {
    next(Err)
  }
})

router.get("/logout", async (req, res, next) => {

  try {
    let result = await db.Session.destroy({
      where: {
        accessToken: req.session.accessToken
      }
    })

    result = result ? {
      status: "success"
    } : {
      status: "failure"
    }
    console.log("Logout, session deleted...")

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

router.patch("/account/edit", async (req, res, next) => {

  try {
    let changes = {}
    let where = {
      where: {
        id: req.session.userId
      }
    }

    if (req.body.username) {
      const alreadyTaken = await db.User
      .findOne({
        where: {
          username: req.body.username
        }
      })
      const user = await db.User.findByPk(req.session.userId)
      if (alreadyTaken && req.body.username !== user.username) {
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

    let result = await db.User.update(changes, where)
    result = result ? {
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

    let result = await db.User.destroy({
      where: {
        id: req.session.userId
      }
    })

    result = result ? {
      status: "success"
    } : {
      status: "failure"
    }
    console.log("Logout and deletion of user...")

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