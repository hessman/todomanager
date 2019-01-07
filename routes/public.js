const express = require("express")
const router = express.Router()
const bcrypt = require("../utils/bcrypt")
const Token = require("../utils/token")
const db = require('../models')

/*
  Index routes
*/

router.get("/", async (req, res, next) => {

  res.render("index", {
    session: req.session,
    user: req.user,
    title: "Todo Manager"
  })
})

/*
  Login routes
*/

router.get("/login", (req, res, next) => {

  res.render("user/login", {
    session: req.session,
    user: req.user,
    title: "Login"
  })
})

router.post("/login", async (req, res, next) => {

  try {

    if (!req.body.username || !req.body.password) {
      throw new Error("Missing information")
    }

    let user = await db.User.findOne({
      where: {
        username: req.body.username
      }
    })

    if (!user) {
      throw new Error("Unknown username")
    }

    user = user.dataValues

    const isValidPassword = await bcrypt.compare(req.body.password, user.password)

    if (!isValidPassword) {
      throw new Error("Invalid password")
    }

    const token = await Token.getRandom()
    const now = new Date()
    let expireDate = new Date()

    // 1 hour session max
    expireDate.setHours(now.getHours() + 1)

    await db.Session.create({
      accessToken: token,
      userId: user.id,
      expiresAt: expireDate
    })

    res.format({

      html: () => {
        res.cookie('AccessToken', token, {
          maxAge: 900000,
          httpOnly: true
        })
        res.redirect('/')
      },

      json: () => {
        res.json({
          accessToken: token
        })
      }
    })

  } catch (Err) {
    next(Err)
  }
})

/*
  Register routes
*/

router.get("/register", (req, res, next) => {

  res.render("user/form", {
    session: req.session,
    user: req.user,
    title: "Register",
    isNew: true
  })
})

router.post("/register", async (req, res, next) => {

  try {

    if (req.body.username && req.body.firstname && req.body.lastname &&
      req.body.password && req.body.confirmPassword) {

      if (req.body.password === req.body.confirmPassword) {
        hashedPassword = await bcrypt.hash(req.body.password)
      } else {
        throw new Error("Password does not match the confirm password")
      }

    } else {
      throw new Error("Missing information")
    }

    const alreadyTaken = await db.User.findOne({
      where: {
        username: req.body.username
      }
    })

    if (alreadyTaken) {
      throw new Error("Username already taken")
    }

    const user = await db.User.create({
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: hashedPassword
    })

    res.format({

      html: () => {
        res.redirect('/login')
      },

      json: () => {
        res.json(user)
      }
    })

  } catch (Err) {
    next(Err)
  }
})



module.exports = router