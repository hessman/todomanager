const cookieParser  = require("cookie-parser")
const createError   = require("http-errors")
const sequelize     = require("sequelize")
const express       = require("express")
const sqlite        = require("sqlite")
const logger        = require("morgan")
const path          = require("path")

const indexRouter   = require("./routes/index")
const usersRouter   = require("./routes/users")
const todosRouter    = require("./routes/todos")

const app = express()

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "assets")))

app.use("/", indexRouter)
app.use("/users", usersRouter)
app.use("/todos", todosRouter)

app.use(function(req, res, next) {
  next(createError(404))
})

app.use(function(err, req, res, next) {

  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  res.status(err.status || 500)
  res.render("error")
})

module.exports = app
