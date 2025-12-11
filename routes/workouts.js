const express = require('express');
const router = express.Router();

const withBasePath = (req, path = '/') => {
  const base = req.app.locals.basePath || '';
  return path === '/' ? base || '/' : `${base}${path}`;
};

// simple auth guard
function redirectLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect(withBasePath(req, '/users/login'));
  }
  next();
}

// GET /workouts  → list workouts for logged-in user
router.get('/', redirectLogin, (req, res, next) => {
  const sql = `
    SELECT *
    FROM workouts
    WHERE user_id = ?
    ORDER BY workout_date DESC, id DESC
  `;

  global.db.query(sql, [req.session.user.id], (err, results) => {
    if (err) return next(err);
    res.render('workouts_list', { workouts: results });
  });
});

// GET /workouts/add  → show form
router.get('/add', redirectLogin, (req, res) => {
  res.render('workouts_add');
});

// POST /workouts/add  → insert workout
router.post('/add', redirectLogin, (req, res, next) => {
  const { workout_date, type, duration_minutes, intensity, notes } = req.body;

  const sql = `
    INSERT INTO workouts (user_id, workout_date, type, duration_minutes, intensity, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  global.db.query(
    sql,
    [
      req.session.user.id,
      workout_date,
      type,
      duration_minutes || null,
      intensity || null,
      notes || null
    ],
    (err) => {
      if (err) return next(err);
      res.redirect(withBasePath(req, '/workouts'));
    }
  );
});

// GET /workouts/search  → simple search by type
router.get('/search', redirectLogin, (req, res, next) => {
  const searchType = req.query.type || '';

  if (!searchType) {
    // first time: just show empty form and no results
    return res.render('workouts_search', { workouts: [], type: '' });
  }

  const sql = `
    SELECT *
    FROM workouts
    WHERE user_id = ?
      AND type LIKE ?
    ORDER BY workout_date DESC, id DESC
  `;

  global.db.query(
    sql,
    [req.session.user.id, '%' + searchType + '%'],
    (err, results) => {
      if (err) return next(err);
      res.render('workouts_search', { workouts: results, type: searchType });
    }
  );
});

module.exports = router;
