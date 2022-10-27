const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const config = require('config');
const mysql = require('mysql');
const db = mysql.createConnection(config.get('db'));

// @route POST api/user/register

// @desc Register user

// @access public
router.post('/', async (req, res) => {
  let errors = {};
  const COLUMNS = ['id', 'fname', 'lname', 'type', 'email'];
  let newUser = {
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    type: req.body.type,
    date: req.body.date,
    createdat: new Date().getTime(),
  };
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
    });
  });
  try {
    db.query(
      'SELECT * FROM users WHERE email = ?',
      [newUser.email],
      function (err, rows, fields) {
        if (err) throw err;
        if (rows.length >= 1) {
          errors.checkemail = true;
          return res.status(400).json(errors);
        } else {
          db.query(
            'SELECT * FROM pendingusers WHERE email = ?',
            [newUser.email],
            function (err, rows, fields) {
              if (err) throw err;
              if (rows.length >= 1) {
                errors.checkemail = true;
                return res.status(400).json(errors);
              } else {
                //new user logic
                db.query(
                  'INSERT INTO pendingusers set ?',
                  newUser,
                  (err, rows, fields) => {
                    if (err) throw err;
                    db.query(
                      'SELECT * FROM pendingusers WHERE email = ? LIMIT 1',
                      [newUser.email],
                      function (err, rows, fields) {
                        if (err) throw err;
                        rows.map((entry) => {
                          const user = {};
                          COLUMNS.forEach((c) => {
                            user[c] = entry[c];
                          });
                          const regNewUser = {
                            id: user.id,
                            fname: user.fname,
                            lname: user.lname,
                            type: user.type,
                            email: user.email,
                          };
                          res.json(regNewUser);
                        });
                      }
                    );
                  }
                );
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

// @route POST api/user/add-sample

// @desc Add sample

// @access private
router.post('/add-sample', auth, async (req, res) => {
  let errors = {};
  const COLUMNS = ['id', 'name', 'username', 'type', 'date', 'createdAt'];
  let newSample = {
    name: req.body.name,
    username: req.body.username,
    type: req.body.type,
    date: req.body.date,
    createdAt: new Date().getTime(),
  };
  try {
    db.query('INSERT INTO samples set ?', newSample, (err, rows, fields) => {
      if (err) throw err;
      db.query(
        'SELECT * FROM samples WHERE name = ? LIMIT 1',
        [newSample.name],
        function (err, rows, fields) {
          if (err) throw err;
          rows.map((entry) => {
            const sample = {};
            COLUMNS.forEach((c) => {
              sample[c] = entry[c];
            });
            const addedSample = {
              id: sample.id,
              name: sample.name,
              username: sample.username,
              type: sample.type,
              date: sample.date,
              createdAt: sample.createdAt,
            };
            res.json(addedSample);
          });
        }
      );
    });
  } catch (err) {
    console.error(err.message);
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

// @route POST api/user/add-site

// @desc Add site

// @access private
router.post('/add-site', auth, async (req, res) => {
  let errors = {};
  const COLUMNS = ['id', 'name', 'location', 'price', 'map'];
  let newSite = {
    name: req.body.name,
    location: req.body.location,
    price: req.body.price,
    map: req.body.map,
  };
  try {
    db.query('INSERT INTO sites set ?', newSite, (err, rows, fields) => {
      if (err) throw err;
      db.query(
        'SELECT * FROM sites WHERE map = ? LIMIT 1',
        [newSite.map],
        function (err, rows, fields) {
          if (err) throw err;
          rows.map((entry) => {
            const site = {};
            COLUMNS.forEach((c) => {
              site[c] = entry[c];
            });
            const addedSite = {
              id: site.id,
              name: site.name,
              username: site.username,
              type: site.type,
              date: site.date,
            };
            res.json(addedSite);
          });
        }
      );
    });
  } catch (err) {
    console.error(err.message);
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

// @route POST api/user/send-pcr

// @desc Send pcr

// @access private
router.post('/send-pcr', auth, async (req, res) => {
  let errors = {};
  const COLUMNS = [
    'id',
    'userId',
    'fname',
    'lname',
    'reason',
    'date',
    'status',
    'createdAt',
  ];
  let newPcr = {
    userId: req.body.userId,
    fname: req.body.fname,
    lname: req.body.lname,
    reason: req.body.reason,
    amount: req.body.amount,
    status: 'Pending',
    date: req.body.date,
    createdAt: new Date().getTime(),
  };
  try {
    db.query(
      'INSERT INTO pettycashrequests set ?',
      newPcr,
      (err, rows, fields) => {
        if (err) throw err;
        db.query(
          'SELECT * FROM pettycashrequests WHERE createdAt = ? LIMIT 1',
          [newPcr.createdAt],
          function (err, rows, fields) {
            if (err) throw err;
            rows.map((entry) => {
              const pcr = {};
              COLUMNS.forEach((c) => {
                pcr[c] = entry[c];
              });
              const addedPcr = {
                id: pcr.id,
                userId: pcr.userId,
                fname: pcr.fname,
                lname: pcr.lname,
                reason: pcr.reason,
                amount: pcr.amount,
                date: pcr.date,
                status: pcr.status,
                createdAt: pcr.createdAt,
              };
              res.json(addedPcr);
            });
          }
        );
      }
    );
  } catch (err) {
    console.error(err.message);
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

// @route GET api/user/pcr/:id

// @desc View user's petty cash requests

// @access private
router.get('/pcr/:id', auth, async (req, res) => {
  let errors = {};
  try {
    db.query(
      `SELECT * FROM pettycashrequests WHERE userId = ?`,
      [req.params.id],
      function (err, rows, fields) {
        if (err) throw err;
        if (rows.length >= 1) {
          res.json(rows);
        } else {
          return res.status(200).json([]);
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

// @route POST api/user/add-officemat

// @desc Add officemat

// @access private
router.post('/add-officemat', auth, async (req, res) => {
  let errors = {};
  const COLUMNS = ['id', 'type', 'name', 'dateofpurchase', 'price', 'buyer'];
  let newMat = {
    type: req.body.type,
    name: req.body.name,
    dateofpurchase: req.body.dop,
    price: req.body.price,
    buyer: req.body.buyer,
    createdAt: new Date().getTime(),
  };
  try {
    db.query(
      'INSERT INTO officematerials set ?',
      newMat,
      (err, rows, fields) => {
        if (err) throw err;
        db.query(
          'SELECT * FROM officematerials WHERE createdAt = ? LIMIT 1',
          [newMat.createdAt],
          function (err, rows, fields) {
            if (err) throw err;
            rows.map((entry) => {
              const mat = {};
              COLUMNS.forEach((c) => {
                mat[c] = entry[c];
              });
              const addedMat = {
                id: mat.id,
                type: mat.type,
                name: mat.name,
                dateofpurchase: mat.dateofpurchase,
                price: mat.price,
                buyer: mat.buyer,
              };
              res.json(addedMat);
            });
          }
        );
      }
    );
  } catch (err) {
    console.error(err.message);
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

module.exports = router;
