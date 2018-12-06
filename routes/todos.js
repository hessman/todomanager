const express = require("express")
const router  = express.Router()
const db = require('../models')

//Post routes
router.post("/", async (req, res, next) => {

    try {

        const todo = await db.todos
        .create({
            message: req.body.message, 
            completion: req.body.completion 
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
    res.render("todo_form", { 
        title: "Add a todo list",
        method: "POST"
    })
})

router.get("/:todoId/edit", async (req, res, next) => {

    try {

        const todo = await db.todos.findByPk(req.params.todoId)

        res.render("todo_form", { 
            title: "Add a todo list",
            todo: todo,
            method: "PATCH"
        })

    } catch (Err) {
        next(Err)
    }
    
})

router.get("/:todoId", async (req, res, next) => {

    try {

        const todo = await db.todos.findByPk(req.params.todoId)

        res.format({

            text: function(){
                res.send(JSON.stringify(todo))
            },
          
            html: function(){
                res.render("show", {  
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
        console.log(filterCompletion)
        const todos = await db.todos.findAndCountAll(options)

        res.format({

            text: function(){
                res.send(JSON.stringify(todos.rows))
            },
          
            html: function(){
                res.render("todos", { 
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

router.delete("/:todoId", async (req, res, next) => {

    try {

        let result = await db.todos
        .destroy({
            where: {
                id: req.params.todoId
            }
        })
        
        result = result ? { status: "success" } : { status: "failure" }

        res.format({

            text: function(){
                res.send(JSON.stringify(result));
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

router.patch("/:todoId", async (req, res, next) => {

    try {

        let changes = {}
        let where = { where: { id: req.params.todoId } }

        if (req.body.message) {
            changes.message = req.body.message
        }

        if (req.body.completion) {
            changes.completion = req.body.completion
        }

        let result = await db.todos.update(changes, where)
        result = result ? { status: "success" } : { status: "failure" }

        res.format({

            text: function(){
                res.send(JSON.stringify(result));
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
