const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

// GET /users/register
router.get('/register', (req, res) => {
  res.render('register');
});

// POST /users/register
router.post('/register', async (req, res, next) => {
  const { username, first_name, last_name, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (username, first_name, last_name, email, hashed_password)
      VALUES (?, ?, ?, ?, ?)
    `;

    global.db.query(sql, [username, first_name, last_name, email, hash], (err) => {
      if (err) return next(err);
      res.redirect('/users/login');
    });
  } catch (err) {
    next(err);
  }
});

// GET /users/login
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// POST /users/login
router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username = ?';
  global.db.query(sql, [username], async (err, results) => {
    if (err) return next(err);

    if (results.length === 0) {
      return res.render('login', { error: 'Invalid username or password' });
    }

    const user = results[0];
    const ok = await bcrypt.compare(password, user.hashed_password);

    if (!ok) {
      return res.render('login', { error: 'Invalid username or password' });
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    res.redirect('/');
  });
});

// GET /users/logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
