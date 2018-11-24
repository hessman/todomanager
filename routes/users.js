const express = require("express")
const router  = express.Router()

router.post("/", function(req, res, next) {
  let param = req.query
  res.send(param)
})

module.exports = router
