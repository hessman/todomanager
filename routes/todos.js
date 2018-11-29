const express = require("express")
const router  = express.Router()
const db = require('../models')

router.post("/", async (req, res, next) => {

    try {

        const todo = await db.todos
        .create({
            message: req.body.message, 
            completion: req.body.completion 
        })

        res.format({

            text: function(){
                res.send(JSON.stringify(todo));
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

router.get("/add", async (req, res, next) => {
    res.render("todo_add", { 
        title: "Add a todo list", 
    })
})

router.get("/:todoId", async (req, res, next) => {

    try {

        const todo = await db.todos.findByPk(req.params.todoId)

        res.format({

            text: function(){
                res.send(JSON.stringify(todo));
            },
          
            html: function(){
                res.render("todo", { 
                    title: "TODO GET", 
                    todo: JSON.stringify(todo)
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
        }

        const todos = await db.todos.findAndCountAll(options)

        res.format({

            text: function(){
                res.send(JSON.stringify(todos.rows));
            },
          
            html: function(){
                res.render("todos", { 
                    title: "TODOS GET", 
                    count: todos.count,
                    todos: JSON.stringify(todos.rows)
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
