const express = require("express")
const router  = express.Router()

router.get("/login", (req, res, next) => {
  res.render("")
})

router.get("/signup", (req, res, next) => {
  res.redirect("/todos")
})

module.exports = router
