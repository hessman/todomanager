const express = require("express")
const bcrypt  = require("../utils/bcrypt")
const router  = express.Router()
const db      = require('../models')

router.get("/:userId", async (req, res, next) => {

})

router.get("/:userId", async (req, res, next) => {

})

router.patch("/:userId", async (req, res, next) => {

    try {

        let changes = {}
        let where = { where: { id: req.params.userId } }

        if (req.body.username) {
            changes.username = req.body.username
        }
        //Check if already taken

        if (req.body.firstname) {
            changes.firstname = req.body.firstname
        }
        if (req.body.lastname) {
            changes.lastname = req.body.lastname
        }

        if (req.body.password && req.body.confirmPassword) {
            changes.description = req.body.description
        }

        let result = await db.User.update(changes, where)
        result = result ? { status: "success" } : { status: "failure" }

        res.format({
            text: function(){
                res.send(JSON.stringify(result))
            },
          
            html: function(){
                res.redirect('/account')
            },
          
            json: function(){
                res.json(result)
            }
        })

    } catch (Err) {
        next(Err)
    }
})

module.exports = router