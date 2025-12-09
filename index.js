require('dotenv').config();
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const mysql = require('mysql2');
const session = require('express-session');
const mainRouter = require('./routes/main');
const usersRouter = require('./routes/users');
const workoutsRouter = require('./routes/workouts');

const app = express();
const PORT = 8000;

// ----- MySQL connection pool -----
const db = mysql.createPool({
  host: process.env.HEALTH_HOST || 'localhost',
  user: process.env.HEALTH_USER || 'health_app',
  password: process.env.HEALTH_PASSWORD || 'qwertyuiop',
  database: process.env.HEALTH_DATABASE || 'health',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// make db easy to use in other files
global.db = db;

// test the connection once at startup
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
  } else {
    console.log('✅ Connected to MySQL database:', process.env.HEALTH_DATABASE);
    connection.release();
  }
});

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');

app.use(expressLayouts);

// parse form data (we'll use this later)
app.use(express.urlencoded({ extended: false }));

// static files (CSS etc) - we'll use this later
app.use(express.static(path.join(__dirname, 'public')));

// sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'supersecretstring',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
  })
);

// expose current user to all views
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

// ROUTES
app.use('/', mainRouter);
app.use('/users', usersRouter);
app.use('/workouts', workoutsRouter);

// 404 handler (basic)
app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(PORT, () => {
  console.log(`Health app running at http://localhost:${PORT}`);
});
