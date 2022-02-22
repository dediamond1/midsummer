const express = require("express");
const helmet = require("helmet");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const csurf = require("csurf");
const homeRoutes = require("./routes/homeRoutes");
const csrfToken = csurf();
const compression = require("compression");
const mongoose = require('mongoose')
const app = express();
const adminRoutes = require('./routes/admin/adminRoutes')
const flash = require('connect-flash')
const session = require('express-session')
const MongoDbSession = require('connect-mongodb-session')(session)
const formData = require("express-form-data");

require('dotenv').config()
app.use(cors());
// app.use(helmet())

const store = new MongoDbSession({
  uri: process.env.MONGO_URI,
  collection: "sessions",
  expires: new Date(Date.now() + (3600 * 1000 * 24))
})

app.use(compression());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: false, store }))
app.use(express.urlencoded({ extended: true }))
app.use(csrfToken)
app.use(flash())
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken()
  res.locals.isLogged = req.session.isLogged
  next()
})
app.use(homeRoutes);
app.use(adminRoutes);

app.get('/500', (req, res, next) => {
  res.render('500', { title: "Error Occurd!!" })
})

app.use((req, res, next) => {
  res.render('404', { title: "404 not found" })
})

app.use((error, req, res, next) => {
  console.log(error)
  res.redirect('/500')
  next()
})

const PORT = process.env.PORT || 4000
const HOST = '0.0.0.0'

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(PORT, HOST, () => {
    console.log(`server is running on http://${HOST}:${PORT}`);
  });
}).catch(err => console.log(err))

