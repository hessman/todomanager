const express = require("express")
const bcrypt  = require("../utils/bcrypt")
const router  = express.Router()
const db      = require('../models')

router.post("/", async (req, res, next) => {

    try {
        
        if (req.body.firstname && req.body.lastname && req.body.password && req.body.confirmPassword) {
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
            firstname: req.body.firstname, 
            lastname: req.body.lastname, 
            password: hashedPassword,
            rank: 1
        })

        res.format({
            text: function(){
                res.send(JSON.stringify(user))
            },
          
            html: function(){
                res.redirect('/login')
            },
          
            json: function(){
                res.json(user)
            }
        })

    } catch (Err) {
        next(Err)
    }
})

module.exports = router