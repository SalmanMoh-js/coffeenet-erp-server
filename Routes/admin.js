const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const config = require('config');
const mysql = require('mysql');
// const sql = require('mssql');
const db = mysql.createConnection(config.get('db'));

// @route POST api/admin/approve-account

// @desc Approve account

// @access private
router.post('/approve-account', auth, async (req, res) => {
  let errors = {};
  const COLUMNS = ['id', 'fname', 'lname', 'type', 'email', 'approvedBy'];
  let newUser = {
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: req.body.password,
    type: req.body.type,
    approvedBy: req.body.approvedBy,
  };
  try {
    db.query(
      `INSERT INTO ${newUser.type} set ?`,
      newUser,
      (err, rows, fields) => {
        if (err) throw err;
        db.query(
          `SELECT * FROM ${newUser.type} WHERE email = ? LIMIT 1`,
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
  } catch (err) {
    console.error(err.message);
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

// @route POST api/admin/reject-account

// @desc Reject account

// @access private
router.post('/reject-account', auth, async (req, res) => {
  let errors = {};
  const id = req.body.id;
  try {
    db.query(
      `DELETE FROM pendingusers WHERE id = ?`,
      [id],
      function (err, result) {
        if (err) throw err;
        res.json(result);
      }
    );
  } catch (err) {
    console.error(err.message);
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

// @route POST api/admin/delete-account

// @desc Delete account

// @access private
router.post('/delete-account', auth, async (req, res) => {
  let errors = {};
  const id = req.body.id;
  const type = req.body.type;
  try {
    db.query(`DELETE FROM ${type} WHERE id = ?`, [id], function (err, result) {
      if (err) throw err;
      res.json(result);
    });
  } catch (err) {
    console.error(err.message);
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

// @route GET api/admin/active-accounts

// @desc View active accounts

// @access private
router.get('/active-accounts', auth, async (req, res) => {
  let errors = {};
  try {
    db.query(
      `SELECT id, fname, lname, email, type, approvedBy FROM users UNION ALL SELECT  id, fname, lname, email, type, approvedBy FROM documenters UNION ALL SELECT  id, fname, lname, email, type, approvedBy FROM financers `,
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
router.get('/activeaccounts', async (req, res) => {
  let errors = {};
  try {
    db.query(`SELECT * FROM users`, function (err, rows, fields) {
      if (err) throw err;
      if (rows.length >= 1) {
        res.json(rows);
      } else {
        return res.status(200).json([]);
      }
    });
  } catch (err) {
    console.error(err.message);
    errors.unknown = true;
    res.status(500).send(errors);
  }
});
// @route GET api/admin/pending-accounts

// @desc View pending accounts

// @access private
router.get('/pending-accounts', auth, async (req, res) => {
  let errors = {};

  try {
    db.query(`SELECT * FROM pendingusers`, function (err, rows, fields) {
      if (err) throw err;
      if (rows.length >= 1) {
        res.json(rows);
      } else {
        return res.status(200).json([]);
      }
    });
  } catch (err) {
    console.error(err.message);
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

// @route GET api/admin/sites

// @desc View sites

// @access private
router.get('/sites', auth, async (req, res) => {
  let errors = {};

  try {
    db.query(`SELECT * FROM sites`, function (err, rows, fields) {
      if (err) throw err;
      if (rows.length >= 1) {
        res.json(rows);
      } else {
        return res.status(200).json([]);
      }
    });
  } catch (err) {
    console.error(err.message);
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

// @route GET api/admin/samples

// @desc View samples

// @access private
router.get('/samples', auth, async (req, res) => {
  let errors = {};

  try {
    db.query(`SELECT * FROM samples`, function (err, rows, fields) {
      if (err) throw err;
      if (rows.length >= 1) {
        res.json(rows);
      } else {
        return res.status(200).json([]);
      }
    });
  } catch (err) {
    console.error(err.message);
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

// @route POST api/admin/add-cupping

// @desc Add cupping

// @access private
router.post('/add-cuppings', auth, async (req, res) => {
  let errors = {};
  const COLUMNS = [
    'id',
    'name',
    'createdby',
    'cup1aroma',
    'cup2aroma',
    'cup3aroma',
    'cup1flavor',
    'cup2flavor',
    'cup3flavor',
    'cup1acidity',
    'cup2acidity',
    'cup3acidity',
    'cup1body',
    'cup2body',
    'cup3body',
    'cup1uniformity',
    'cup2uniformity',
    'cup3uniformity',
    'cup1cleancup',
    'cup2cleancup',
    'cup3cleancup',
    'cup1aftertaste',
    'cup2aftertaste',
    'cup3aftertaste',
    'cup1balance',
    'cup2balance',
    'cup3balance',
    'cup1sweetness',
    'cup2sweetness',
    'cup3sweetness',
    'cup1overall',
    'cup2overall',
    'cup3overall',
    'cup1total',
    'cup2total',
    'cup3total',
    'defects',
    'finalscore',
    'qualityscale',
  ];
  let newCupping = {
    name: req.body.name,
    createdby: req.body.createdBy,
    cup1aroma: req.body.cup1.aroma,
    cup1flavor: req.body.cup1.flavor,
    cup1acidity: req.body.cup1.acidity,
    cup1body: req.body.cup1.body,
    cup1uniformity: req.body.cup1.uniformity,
    cup1cleancup: req.body.cup1.cleancup,
    cup1aftertaste: req.body.cup1.aftertaste,
    cup1balance: req.body.cup1.balance,
    cup1sweetness: req.body.cup1.sweetness,
    cup1overall: req.body.cup1Overall,
    cup1total: req.body.cup1Total,
    cup2aroma: req.body.cup2.aroma,
    cup2flavor: req.body.cup2.flavor,
    cup2acidity: req.body.cup2.acidity,
    cup2body: req.body.cup2.body,
    cup2uniformity: req.body.cup2.uniformity,
    cup2cleancup: req.body.cup2.cleancup,
    cup2aftertaste: req.body.cup2.aftertaste,
    cup2balance: req.body.cup2.balance,
    cup2sweetness: req.body.cup2.sweetness,
    cup2overall: req.body.cup2Overall,
    cup2total: req.body.cup2Total,
    cup3aroma: req.body.cup3.aroma,
    cup3flavor: req.body.cup3.flavor,
    cup3acidity: req.body.cup3.acidity,
    cup3body: req.body.cup3.body,
    cup3uniformity: req.body.cup3.uniformity,
    cup3cleancup: req.body.cup3.cleancup,
    cup3aftertaste: req.body.cup3.aftertaste,
    cup3balance: req.body.cup3.balance,
    cup3sweetness: req.body.cup3.sweetness,
    cup3overall: req.body.cup3Overall,
    cup3total: req.body.cup3Total,
    finalscore: (
      (req.body.cup1Total + req.body.cup2Total + req.body.cup3Total) /
      3
    ).toFixed(2),
    qualityscale: req.body.qualityscale,
  };
  try {
    db.query('INSERT INTO cuppings set ?', newCupping, (err, rows, fields) => {
      if (err) throw err;
      db.query(
        'SELECT * FROM cuppings WHERE name = ? LIMIT 1',
        [newCupping.name],
        function (err, rows, fields) {
          if (err) throw err;
          rows.map((entry) => {
            const cup = {};
            COLUMNS.forEach((c) => {
              cup[c] = entry[c];
            });
            const addedCup = {
              id: cup.id,
              name: cup.name,
              createdby: cup.createdby,
              cup1aroma: cup.cup1aroma,
              cup1flavor: cup.cup1flavor,
              cup1acidity: cup.cup1acidity,
              cup1body: cup.cup1body,
              cup1uniformity: cup.cup1uniformity,
              cup1cleancup: cup.cup1cleancup,
              cup1aftertaste: cup.cup1aftertaste,
              cup1balance: cup.cup1balance,
              cup1sweetness: cup.cup1sweetness,
              cup1overall: cup.cup1overall,
              cup1total: cup.cup1total,
              cup2aroma: cup.cup2aroma,
              cup2flavor: cup.cup2flavor,
              cup2acidity: cup.cup2acidity,
              cup2body: cup.cup2body,
              cup2uniformity: cup.cup2uniformity,
              cup2cleancup: cup.cup2cleancup,
              cup2aftertaste: cup.cup2aftertaste,
              cup2balance: cup.cup2balance,
              cup2sweetness: cup.cup2sweetness,
              cup2overall: cup.cup2overall,
              cup2total: cup.cup2total,
              cup3aroma: cup.cup3aroma,
              cup3flavor: cup.cup3flavor,
              cup3acidity: cup.cup3acidity,
              cup3body: cup.cup3body,
              cup3uniformity: cup.cup3uniformity,
              cup3cleancup: cup.cup3cleancup,
              cup3aftertaste: cup.cup3aftertaste,
              cup3balance: cup.cup3balance,
              cup3sweetness: cup.cup3sweetness,
              cup3overall: cup.cup3overall,
              cup3total: cup.cup3total,
              finalscore: cup.finalscore,
              defect: cup.defect,
              qualityscale: cup.qualityscale,
            };
            res.json(addedCup);
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

// @route GET api/admin/cuppings

// @desc View cuppings

// @access private
router.get('/cuppings', auth, async (req, res) => {
  let errors = {};
  try {
    db.query(`SELECT * FROM cuppings`, function (err, rows, fields) {
      if (err) throw err;
      if (rows.length >= 1) {
        res.json(rows);
      } else {
        return res.status(200).json([]);
      }
    });
  } catch (err) {
    console.error(err.message);
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

// @route GET api/admin/officemat

// @desc View office materials

// @access private
router.get('/officemat', auth, async (req, res) => {
  let errors = {};

  try {
    db.query(`SELECT * FROM officematerials`, function (err, rows, fields) {
      if (err) throw err;
      if (rows.length >= 1) {
        res.json(rows);
      } else {
        return res.status(200).json([]);
      }
    });
  } catch (err) {
    console.error(err.message);
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

// @route GET api/admin/pcr

// @desc View petty cash requests

// @access private
router.get('/pcr', auth, async (req, res) => {
  let errors = {};
  try {
    db.query(`SELECT * FROM pettycashrequests`, function (err, rows, fields) {
      if (err) throw err;
      if (rows.length >= 1) {
        res.json(rows);
      } else {
        return res.status(200).json([]);
      }
    });
  } catch (err) {
    console.error(err.message);
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

// @route POST api/admin/approve-pcr

// @desc Approve petty cash request

// @access private
router.post('/approve-pcr', auth, async (req, res) => {
  let errors = {};
  const id = req.body.id;
  const COLUMNS = [
    'id',
    'fname',
    'lname',
    'reason',
    'amount',
    'date',
    'status',
    'createdAt',
  ];
  try {
    db.query(
      'UPDATE pettycashrequests SET status = ? WHERE id = ?',
      ['Approved', id],
      function (err, rows, fields) {
        if (err) throw err;
        rows.map((entry) => {
          const pcr = {};
          COLUMNS.forEach((c) => {
            pcr[c] = entry[c];
          });
          const approvedPcr = {
            id: pcr.id,
            fname: pcr.fname,
            lname: pcr.lname,
            reason: pcr.reason,
            amount: pcr.amount,
            date: pcr.date,
            status: pcr.status,
            createdAt: pcr.createdAt,
          };
          res.json(approvedPcr);
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

// @route POST api/admin/reject-pcr

// @desc Reject petty cash request

// @access private
router.post('/reject-pcr', auth, async (req, res) => {
  let errors = {};
  const id = req.body.id;
  const COLUMNS = [
    'id',
    'fname',
    'lname',
    'reason',
    'amount',
    'date',
    'status',
    'createdAt',
  ];
  try {
    db.query(
      'UPDATE pettycashrequests SET status = ? WHERE id = ?',
      ['Rejected', id],
      function (err, rows, fields) {
        if (err) throw err;
        rows.map((entry) => {
          const pcr = {};
          COLUMNS.forEach((c) => {
            pcr[c] = entry[c];
          });
          const rejectedPcr = {
            id: pcr.id,
            fname: pcr.fname,
            lname: pcr.lname,
            reason: pcr.reason,
            amount: pcr.amount,
            date: pcr.date,
            status: pcr.status,
            createdAt: pcr.createdAt,
          };
          res.json(rejectedPcr);
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

// @route GET api/admin/vehicles

// @desc View vehicles

// @access private
router.get('/vehicles', auth, async (req, res) => {
  let errors = {};
  try {
    db.query(`SELECT * FROM vehicles`, function (err, rows, fields) {
      if (err) throw err;
      if (rows.length >= 1) {
        res.json(rows);
      } else {
        return res.status(200).json([]);
      }
    });
  } catch (err) {
    console.error(err.message);
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

// @route GET api/admin/test

// @access private

// const sqlconfig = {
//   server: '192.168.1.4',
//   user: 'saa',
//   password: 'saaadmin',
//   database: 'GSF',
//   options: {
//     trustServerCertificate: true,
//   },
// };
// sql
//   .connect(sqlconfig)
//   .then((pool) => {
//     console.log('Remote Connected');
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// router.get('/test', async (req, res) => {
//   let errors = {};
//   const request = new sql.Request();
//   try {
//     request.query('select * from SystemUsers', (err, result) => {
//       res.json(result.recordsets[0]);
//     });
//   } catch (err) {
//     console.error(err.message);
//     errors.unknown = true;
//     res.status(500).send(errors);
//   }
// });
module.exports = router;
