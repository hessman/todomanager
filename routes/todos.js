const express = require("express")
const router  = express.Router()
const db      = require('../models')

const validCompletionStatus = ["todo", "in progress", "done"]

//Post routes
router.post("/", async (req, res, next) => {

    try {

        let completion = validCompletionStatus.includes(req.body.completion) ? req.body.completion : "todo"
        let title = req.body.title ? req.body.title : "no title"
        let description = req.body.description ? req.body.description : "no description"

        const todo = await db.Todo
        .create({
            title: title, 
            description: description, 
            completion: completion 
        })

        res.format({
            text: function(){
                res.send(JSON.stringify(todo))
            },
          
            html: function(){
                res.redirect('/todos')
            },
          
            json: function(){
                res.json(todo)
            }
        })

    } catch (Err) {
        next(Err)
    }
})

//Get routes
router.get("/add", async (req, res, next) => {

    res.render("todo/form", { 
        title: "Add a todo list",
        isNew : true
    })
})

router.get("/:todoId/edit", async (req, res, next) => {

    try {

        const todo = await db.Todo.findByPk(req.params.todoId)

        res.render("todo/form", { 
            title: "Add a todo list",
            todo: todo,
            isNew: false
        })

    } catch (Err) {
        next(Err)
    }
    
})

router.get("/:todoId", async (req, res, next) => {

    try {

        const todo = await db.Todo.findByPk(req.params.todoId)

        res.format({
            text: function(){
                res.send(JSON.stringify(todo))
            },
          
            html: function(){
                res.render("todo/show", {  
                    todo: todo
                })
            },
          
            json: function(){
                res.json(todo)
            }
        })

    } catch (Err) {
        next(Err)
    }
})

router.get("/", async (req, res, next) => {

    try {

        let options = {}

        if (req.query.limit) {
            req.query.offset = req.query.offset ? req.query.offset : 0

            options.limit = req.query.limit
            options.offset = req.query.offset
        }
        if (req.query.completion) {
            options.where = { completion : req.query.completion }
            filterCompletion = req.query.completion
        } else {
            filterCompletion = "todo"
        }

        const todos = await db.Todo.findAndCountAll(options)

        res.format({
            text: function(){
                res.send(JSON.stringify(todos.rows))
            },
          
            html: function(){
                res.render("todo/list", { 
                    count: todos.count,
                    todos: todos.rows,
                    filterCompletion: filterCompletion
                })
            },
          
            json: function(){
                res.json(todos)
            }
        })

    } catch (Err) {
        next(Err)
    }
})

// Delete routes
router.delete("/:todoId", async (req, res, next) => {

    try {

        let result = await db.Todo
        .destroy({
            where: {
                id: req.params.todoId
            }
        })
        
        result = result ? { status: "success" } : { status: "failure" }

        res.format({
            text: function(){
                res.send(JSON.stringify(result))
            },
          
            html: function(){
                res.redirect('/todos')
            },
          
            json: function(){
                res.json(result)
            }
        })

    } catch (Err) {
        next(Err)
    }
})

// Patch routes
router.patch("/:todoId", async (req, res, next) => {

    try {

        let changes = {}
        let where = { where: { id: req.params.todoId } }

        if (req.body.title) {
            changes.title = req.body.title
        }
        if (req.body.description) {
            changes.description = req.body.description
        }
        if (validCompletionStatus.includes(req.body.completion)) {
            changes.completion = req.body.completion
        }

        let result = await db.Todo.update(changes, where)
        result = result ? { status: "success" } : { status: "failure" }

        res.format({
            text: function(){
                res.send(JSON.stringify(result))
            },
          
            html: function(){
                res.redirect('/todos')
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
