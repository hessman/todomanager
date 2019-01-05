const methodOverride = require("method-override")

const cookieParser   = require("cookie-parser")
const createError    = require("http-errors")

const publicRouter   = require("./routes/public")
const todosRouter    = require("./routes/todos")
const usersRouter    = require("./routes/users")

const session        = require("./utils/session")

const express        = require("express")
const logger         = require("morgan")
const path           = require("path")

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

app.use(session.check)

/*  Public routes
    Such as /, /login, /register
*/
app.use("/", publicRouter)

app.use(session.redirect)

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
        session: req.session
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