const methodOverride = require("method-override")

const cookieParser   = require("cookie-parser")
const createError    = require("http-errors")

const express        = require("express")
const logger         = require("morgan")
const path           = require("path")

//const sessionsRouter = require("./routes/sessions")
const indexRouter    = require("./routes/index")
const todosRouter    = require("./routes/todos")
const usersRouter    = require("./routes/users")
const teamsRouter    = require("./routes/teams")

const app = express()
const db  = require("./models")

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "assets")))

app.use(methodOverride('_method'))

/* Public routes
   Such as /, /login, /register and /logout
*/
app.use("/", indexRouter)

// Session's checker middleware
app.use("*", async (req, res, next) => {

  try {

    if(req.cookies.accessToken === undefined) {
      console.log("No cookie...")
      res.redirect('/login')
      return
    }

    let session = await db.Session.findOne({ where: {accessToken: req.cookies.accessToken} })
    if (session === null) {
      console.log("Invalid session...")
      res.redirect('/login')
      return
    }
    
    session = session.dataValues

    if (session.expiresAt < new Date()) {
      console.log("accessToken too old...")
      res.clearCookie('accessToken')
      res.redirect('/login')
      return
    }

    req.session = session
    next()

  } catch (Err) {
    next(Err)
  }
})

// Private routes
app.use("/todos", todosRouter)
app.use("/users", usersRouter)
//app.use("/sessions", sessionsRouter)
//app.use("/teams", teamsRouter)

// Errors' middlewares
app.use( (req, res, next) => {
  next(createError(404))
})

app.use( (err, req, res, next) => {

  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  res.status(err.status || 500)
  res.format({
    text: function(){
        res.send(JSON.stringify("Error : " + err.message))
    },
  
    html: function(){
        res.render("error")
    },
  
    json: function(){
        res.json(err)
    }
  })
})

module.exports = app