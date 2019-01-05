const express = require("express")
const router  = express.Router()
const bcrypt  = require("../utils/bcrypt")
const Token   = require("../utils/token")
const db      = require('../models')


router.get("/", async (req, res, next) => {

  let isConnected = false
  let firstname

  if(req.cookies.accessToken !== undefined) {
    let session = await db.Session.findOne({ where: {accessToken: req.cookies.accessToken} })
    if (session !== null) {
      session = session.dataValues
      if (session.expiresAt > new Date()) {
        isConnected = true
        const user = await db.User.findOne({ where: {id: session.userId} })
        firstname = user.dataValues.firstname
      }
    }
  }

  res.render("index", {
    isConnected: isConnected,
    firstname: firstname
  })
})

router.get("/login", (req, res, next) => {
  res.render("user/login")
})

router.post("/login", async (req, res, next) => {

  try {

    if(!req.body.username || !req.body.password) {
      throw new Error("Missing information")
    }

    let user = await db.User.findOne({ where: {username: req.body.username} })

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
    expireDate = expireDate.setMinutes(now.getMinutes() + 1);

    await db.Session
    .create({       
       accessToken: token,
       userId: user.id,
       expiresAt: expireDate
    })

    const tokenJSON = { accessToken: token }

    res.format({
      text: () => {
        res.send(JSON.stringify(tokenJSON))
      },

      html: () => {
        console.log("Sending of the cookie...")
        res.cookie('accessToken', token, { maxAge: 900000, httpOnly: true })
        res.redirect('/')
      },
    
      json: () => {
        res.json(tokenJSON)
      }
  })

  } catch (Err) {
    next(Err)
  }
})

router.get("/register", (req, res, next) => {
  res.render("user/register")
})

router.post("/register", async (req, res , next) => {

  try {
        
    if (req.body.username && req.body.firstname && req.body.lastname && req.body.password && req.body.confirmPassword) {
        if (req.body.password === req.body.confirmPassword) {
            hashedPassword = await bcrypt.hash(req.body.password)
        } else {
            throw new Error("Password does not match the confirm password")
        }
    } else {
        console.log(req.body)
        throw new Error("Missing information")
    }

    const user = await db.User
    .create({
        username: req.body.username,
        firstname: req.body.firstname, 
        lastname: req.body.lastname, 
        password: hashedPassword,
        rank: 1
    })

    res.format({
        text: () => {
            res.send(JSON.stringify(user))
        },
      
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
