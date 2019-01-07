const express = require("express")
const router = express.Router()
const db = require('../models')

const validCompletionStatus = ["todo", "in progress", "done"]

/*
    Post routes
*/

router.post("/", async (req, res, next) => {

  try {

    let completion = validCompletionStatus.includes(req.body.completion) ? req.body.completion : "todo"
    let title = req.body.title ? req.body.title : "no title"
    let description = req.body.description ? req.body.description : "no description"

    const todo = await db.Todo
      .create({
        title: title,
        description: description,
        completion: completion,
      })

    const user = await db.User.findByPk(req.user.id)

    await todo.setUser(user)

    res.format({

      html: function () {
        res.redirect('/todos')
      },

      json: function () {
        res.json(todo)
      }
    })

  } catch (Err) {
    next(Err)
  }
})

/*
    Get routes
*/

router.get("/add", async (req, res, next) => {

  res.render("todo/form", {
    title: "Add a todo list",
    session: req.session,
    user: req.user,
    isNew: true
  })
})

router.get("/:todoId/edit", async (req, res, next) => {

  try {

    const todo = await db.Todo.findByPk(req.params.todoId)

    if (todo.userId !== req.user.id) {
      throw new Error("Invalid todo id")
    }

    res.render("todo/form", {
      title: "Add a todo list",
      session: req.session,
      user: req.user,
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

    if (todo.userId !== req.user.id) {
      throw new Error("Invalid todo id")
    }

    res.format({

      html: () => {
        res.render("todo/show", {
          title: todo.title,
          todo: todo,
          session: req.session,
          user: req.user
        })
      },

      json: () => {
        res.json(todo)
      }
    })

  } catch (Err) {
    next(Err)
  }
})

router.get("/", async (req, res, next) => {

  try {

    let options = {
      where: {
        userId: req.user.id
      }
    }

    if (req.query.limit) {
      req.query.offset = req.query.offset ? req.query.offset : 0

      options.limit = req.query.limit
      options.offset = req.query.offset
    }
    if (req.query.completion) {
      options.where.completion = req.query.completion
    }

    const todos = await db.Todo.findAndCountAll(options)

    res.format({

      html: () => {
        res.render("todo/list", {
          title: "Todos",
          count: todos.count,
          todos: todos.rows,
          session: req.session,
          user: req.user
        })
      },

      json: () => {
        res.json(todos)
      }
    })

  } catch (Err) {
    next(Err)
  }
})

/* 
    Delete routes
*/

router.delete("/:todoId", async (req, res, next) => {

  try {

    let result = await db.Todo
      .destroy({
        where: {
          id: req.params.todoId,
          userId: req.user.id
        }
      })

    result = result ? {
      status: "success"
    } : {
        status: "failure"
      }

    res.format({

      html: () => {
        res.redirect('/todos')
      },

      json: () => {
        res.json(result)
      }
    })

  } catch (Err) {
    next(Err)
  }
})

/* 
    Patch routes
*/

router.patch("/:todoId", async (req, res, next) => {

  try {

    let changes = {}
    let where = {
      where: {
        id: req.params.todoId,
        userId: req.user.id
      }
    }

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
    result = result ? {
      status: "success"
    } : {
        status: "failure"
      }

    res.format({

      html: function () {
        res.redirect('/todos')
      },

      json: function () {
        res.json(result)
      }
    })

  } catch (Err) {
    next(Err)
  }
})

module.exports = router