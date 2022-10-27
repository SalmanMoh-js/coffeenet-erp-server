const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const mysql = require('mysql');
const db = mysql.createConnection(config.get('db'));

// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get('/', auth, (req, res) => {
  let errors = {};
  const COLUMNS = ['id', 'fname', 'lname', 'email'];
  try {
    db.query(
      'SELECT * FROM users WHERE id = ?',
      [req.user.id],
      async function (err, rows, fields) {
        if (err) throw err;
        if (rows.length >= 1) {
          rows.map((entry) => {
            const user = {};
            COLUMNS.forEach((c) => {
              user[c] = entry[c];
            });
            const loggedUser = {
              id: user.id,
              fname: user.fname,
              lname: user.lname,
              email: user.email,
            };
            res.json(loggedUser);
          });
        } else {
          errors.authError = true;
          return res.status(400).json(errors);
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

// @route    GET api/auth/admin
// @desc     Get admin by token
// @access   Private
router.get('/admin', auth, (req, res) => {
  let errors = {};
  const COLUMNS = ['id', 'fname', 'mname', 'lname', 'email'];
  try {
    db.query(
      'SELECT * FROM admins WHERE email = ?',
      [req.user.email],
      async function (err, rows, fields) {
        if (err) throw err;
        if (rows.length >= 1) {
          rows.map((entry) => {
            const user = {};
            COLUMNS.forEach((c) => {
              user[c] = entry[c];
            });
            const loggedUser = {
              id: user.id,
              fname: user.fname,
              lname: user.lname,
              email: user.email,
            };
            res.json(loggedUser);
          });
        } else {
          errors.authError = true;
          return res.status(400).json(errors);
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

// @route    GET api/auth/financer
// @desc     Get financer by token
// @access   Private
router.get('/financer', auth, (req, res) => {
  let errors = {};
  const COLUMNS = ['id', 'fname', 'mname', 'lname', 'email'];
  try {
    db.query(
      'SELECT * FROM financers WHERE email = ?',
      [req.user.email],
      async function (err, rows, fields) {
        if (err) throw err;
        if (rows.length >= 1) {
          rows.map((entry) => {
            const user = {};
            COLUMNS.forEach((c) => {
              user[c] = entry[c];
            });
            const loggedUser = {
              id: user.id,
              fname: user.fname,
              lname: user.lname,
              email: user.email,
            };
            res.json(loggedUser);
          });
        } else {
          errors.authError = true;
          return res.status(400).json(errors);
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

// @route    GET api/auth/documenter
// @desc     Get documenter by token
// @access   Private
router.get('/documenter', auth, (req, res) => {
  let errors = {};
  const COLUMNS = ['id', 'fname', 'mname', 'lname', 'email'];
  try {
    db.query(
      'SELECT * FROM documenters WHERE email = ?',
      [req.user.email],
      async function (err, rows, fields) {
        if (err) {
          errors.unknown = true;
          res.status(500).send(errors);
        }
        if (rows.length >= 1) {
          rows.map((entry) => {
            const user = {};
            COLUMNS.forEach((c) => {
              user[c] = entry[c];
            });
            const loggedUser = {
              id: user.id,
              fname: user.fname,
              lname: user.lname,
              email: user.email,
            };
            res.json(loggedUser);
          });
        } else {
          errors.authError = true;
          return res.status(400).json(errors);
        }
      }
    );
  } catch (err) {
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post('/', async (req, res) => {
  let errors = {};
  const COLUMNS = ['id', 'fname', 'lname', 'email', 'password'];
  const { email, password } = req.body;
  try {
    db.query(
      'SELECT * FROM pendingusers WHERE email = ?',
      [email],
      function (err, rows, fields) {
        if (err) throw err;
        if (rows.length >= 1) {
          errors.pending = true;
          return res.status(400).json(errors);
        } else {
          db.query(
            'SELECT * FROM users WHERE email = ? LIMIT 1',
            [email],
            async function (err, rows, fields) {
              if (err) throw err;
              if (rows.length >= 1) {
                if (err) throw err;
                rows.map(async (entry) => {
                  const user = {};
                  COLUMNS.forEach((c) => {
                    user[c] = entry[c];
                  });
                  const User = {
                    password: user.password,
                  };
                  const isMatch = await bcrypt.compare(password, User.password);
                  if (!isMatch) {
                    errors.password = true;
                    return res.status(400).json(errors);
                  }
                  const payload = {
                    user: {
                      id: user.id,
                    },
                  };

                  jwt.sign(
                    payload,
                    config.get('jwtSecret'),
                    { expiresIn: 360000 },
                    (err, token) => {
                      if (err) throw err;
                      res.json({ token });
                    }
                  );
                });
              } else {
                errors.user = true;
                return res.status(400).json(errors);
              }
            }
          );
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

// @route    POST api/auth/admin
// @desc     Authenticate Admin & get token
// @access   Public
router.post('/admin', async (req, res) => {
  let errors = {};
  const { email, password } = req.body;
  const COLUMNS = ['id', 'fname', 'lname', 'email', 'password'];
  try {
    db.query(
      'SELECT * FROM admins WHERE email = ?',
      [email],
      async function (err, rows, fields) {
        if (err) throw err;
        if (rows.length >= 1) {
          if (err) throw err;
          rows.map(async (entry) => {
            const user = {};
            COLUMNS.forEach((c) => {
              user[c] = entry[c];
            });
            const User = {
              password: user.password,
            };
            const isMatch = await bcrypt.compare(password, User.password);
            if (!isMatch) {
              errors.password = true;
              return res.status(400).json(errors);
            }
            const payload = {
              user: {
                email: user.email,
              },
            };

            jwt.sign(
              payload,
              config.get('jwtSecret'),
              { expiresIn: 360000 },
              (err, token) => {
                if (err) throw err;
                res.json({ token });
              }
            );
          });
        } else {
          errors.admin = true;
          return res.status(400).json(errors);
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

// @route    POST api/auth/financer
// @desc     Authenticate Financer & get token
// @access   Public
router.post('/financer', async (req, res) => {
  let errors = {};
  const { email, password } = req.body;
  const COLUMNS = ['id', 'fname', 'lname', 'email', 'password'];
  try {
    db.query(
      'SELECT * FROM financers WHERE email = ?',
      [email],
      async function (err, rows, fields) {
        if (err) throw err;
        if (rows.length >= 1) {
          if (err) throw err;
          rows.map(async (entry) => {
            const user = {};
            COLUMNS.forEach((c) => {
              user[c] = entry[c];
            });
            const User = {
              password: user.password,
            };
            const isMatch = await bcrypt.compare(password, User.password);
            if (!isMatch) {
              errors.password = true;
              return res.status(400).json(errors);
            }
            const payload = {
              user: {
                email: user.email,
              },
            };

            jwt.sign(
              payload,
              config.get('jwtSecret'),
              { expiresIn: 360000 },
              (err, token) => {
                if (err) throw err;
                res.json({ token });
              }
            );
          });
        } else {
          errors.financer = true;
          return res.status(400).json(errors);
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

// @route    POST api/auth/documenter
// @desc     Authenticate Documenter & get token
// @access   Public
router.post('/documenter', async (req, res) => {
  let errors = {};
  const { email, password } = req.body;
  const COLUMNS = ['id', 'fname', 'lname', 'email', 'password'];
  try {
    db.query(
      'SELECT * FROM documenters WHERE email = ?',
      [email],
      async function (err, rows, fields) {
        if (err) throw err;
        if (rows.length >= 1) {
          if (err) {
            errors.unknown = true;
            res.status(500).send(errors);
          }
          rows.map(async (entry) => {
            const user = {};
            COLUMNS.forEach((c) => {
              user[c] = entry[c];
            });
            const User = {
              password: user.password,
            };
            const isMatch = await bcrypt.compare(password, User.password);
            if (!isMatch) {
              errors.password = true;
              return res.status(400).json(errors);
            }
            const payload = {
              user: {
                email: user.email,
              },
            };

            jwt.sign(
              payload,
              config.get('jwtSecret'),
              { expiresIn: 360000 },
              (err, token) => {
                if (err) throw err;
                res.json({ token });
              }
            );
          });
        } else {
          errors.user = true;
          return res.status(400).json(errors);
        }
      }
    );
  } catch (err) {
    errors.unknown = true;
    res.status(500).send(errors);
  }
});
module.exports = router;
