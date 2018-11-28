const express = require("express")
const router  = express.Router()
const db = require('../models')

router.get("/", async (req, res, next) => {

    try {

        const todos = await db.todos.findAndCountAll()
        
        if (req.get("accept").includes("text/html")) {
            res.render("todos", { 
                title: "TODOS GET", 
                count: todos.count,
                todos: JSON.stringify(todos.rows)
            })
        } else {
            res.json(todos)
        }

    } catch (Err) {
        next(Err)
    }
})

router.post("/", async (req, res, next) => {

    try {

        const result = await db.todos
        .create({
            message: req.body.message, 
            completion: req.body.completion 
        })
        res.json(result)

    } catch (Err) {
        next(Err)
    }
})

module.exports = router
