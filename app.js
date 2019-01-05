const methodOverride = require("method-override")

const cookieParser = require("cookie-parser")
const createError  = require("http-errors")

const express = require("express")
const logger  = require("morgan")
const path    = require("path")

const SessionChecker = require("./utils/sessionChecker")
const indexRouter    = require("./routes/index")
const todosRouter    = require("./routes/todos")
const usersRouter    = require("./routes/users")

const app = express()

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "assets")))
app.use(methodOverride('_method'))

// Passive session's checker
app.use(SessionChecker.passive)

/*  Public routes
    Such as /, /login, /register
*/
app.use("/", indexRouter)

// Active session's checker
app.use(SessionChecker.active)

/*  Private routes
    Such as /account, /todos and /logout
*/
app.use("/", usersRouter)
app.use("/todos", todosRouter)

// Error's middlewares
app.use((req, res, next) => {
  next(createError(404))
})

app.use((err, req, res, next) => {

  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  res.status(err.status || 500)
  res.format({
    text: () => {
      res.send(JSON.stringify("Error : " + err.message))
    },

    html: () => {
      res.render("error", {
        info: req.info
      })
    },

    json: () => {
      res.json({
        error: err.message
      })
    }
  })
})

module.exports = app