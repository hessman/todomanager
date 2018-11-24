const express = require('express')
const router  = express.Router()

router.get('/', function(req, res, next) {
    res.render('todos', { title: 'TODOS' })
})

module.exports = router