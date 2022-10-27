const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const config = require('config');
const mysql = require('mysql');
const db = mysql.createConnection(config.get('db'));

// @route POST api/document/add-invoice

// @desc Add invoice

// @access private
router.post('/add-invoice', auth, async (req, res) => {
  let errors = {};
  try {
    db.query(
      'INSERT INTO commercialinvoices set ?',
      req.body,
      (err, rows, fields) => {
        if (err) {
          console.log(err);
          errors.unknown = true;
          res.status(500).send(errors);
        }
        res.json(fields);
      }
    );
  } catch (err) {
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

// @route GET api/document/invoices

// @desc View invoices

// @access private
router.get('/invoices', auth, async (req, res) => {
  let errors = {};

  try {
    db.query(`SELECT * FROM commercialinvoices`, function (err, rows, fields) {
      if (err) {
        errors.unknown = true;
        res.status(500).send(errors);
      }
      if (rows.length >= 1) {
        res.json(rows);
      } else {
        return res.status(200).json([]);
      }
    });
  } catch (err) {
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

// @route POST api/document/add-shipping

// @desc Add shipping

// @access private
router.post('/add-shipping', auth, async (req, res) => {
  let errors = {};
  try {
    db.query(
      'INSERT INTO shippinginstructions set ?',
      req.body,
      (err, rows, fields) => {
        if (err) {
          console.log(err);
          errors.unknown = true;
          res.status(500).send(errors);
        }
        res.json(fields);
      }
    );
  } catch (err) {
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

// @route GET api/document/shippings

// @desc View shippings

// @access private
router.get('/shippings', auth, async (req, res) => {
  let errors = {};

  try {
    db.query(
      `SELECT * FROM shippinginstructions`,
      function (err, rows, fields) {
        if (err) {
          errors.unknown = true;
          res.status(500).send(errors);
        }
        if (rows.length >= 1) {
          res.json(rows);
        } else {
          return res.status(200).json([]);
        }
      }
    );
  } catch (err) {
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

// @route POST api/document/add-packing

// @desc Add packing

// @access private
router.post('/add-packing', auth, async (req, res) => {
  let errors = {};
  try {
    db.query(
      'INSERT INTO packinglists set ?',
      req.body,
      (err, rows, fields) => {
        if (err) {
          console.log(err);
          errors.unknown = true;
          res.status(500).send(errors);
        }
        res.json(fields);
      }
    );
  } catch (err) {
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

// @route GET api/document/packings

// @desc View packing lists

// @access private
router.get('/packings', auth, async (req, res) => {
  let errors = {};

  try {
    db.query(`SELECT * FROM packinglists`, function (err, rows, fields) {
      if (err) {
        errors.unknown = true;
        res.status(500).send(errors);
      }
      if (rows.length >= 1) {
        res.json(rows);
      } else {
        return res.status(200).json([]);
      }
    });
  } catch (err) {
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

// @route POST api/document/add-waybill

// @desc Add waybill

// @access private
router.post('/add-waybill', auth, async (req, res) => {
  let errors = {};
  try {
    db.query('INSERT INTO waybills set ?', req.body, (err, rows, fields) => {
      if (err) {
        console.log(err);
        errors.unknown = true;
        res.status(500).send(errors);
      }
      res.json(fields);
    });
  } catch (err) {
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

// @route GET api/document/waybills

// @desc View waybills

// @access private
router.get('/waybills', auth, async (req, res) => {
  let errors = {};

  try {
    db.query(`SELECT * FROM waybills`, function (err, rows, fields) {
      if (err) {
        errors.unknown = true;
        res.status(500).send(errors);
      }
      if (rows.length >= 1) {
        res.json(rows);
      } else {
        return res.status(200).json([]);
      }
    });
  } catch (err) {
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

// @route POST api/document/add-cert

// @desc Add certificate

// @access private
router.post('/add-cert', auth, async (req, res) => {
  let errors = {};
  try {
    db.query(
      'INSERT INTO certificates set ?',
      req.body,
      (err, rows, fields) => {
        if (err) {
          console.log(err);
          errors.unknown = true;
          res.status(500).send(errors);
        }
        res.json(fields);
      }
    );
  } catch (err) {
    errors.unknown = true;
    res.status(500).send(errors);
  }
});

// @route GET api/document/certs

// @desc View certificates

// @access private
router.get('/certs', auth, async (req, res) => {
  let errors = {};

  try {
    db.query(`SELECT * FROM certificates`, function (err, rows, fields) {
      if (err) {
        errors.unknown = true;
        res.status(500).send(errors);
      }
      if (rows.length >= 1) {
        res.json(rows);
      } else {
        return res.status(200).json([]);
      }
    });
  } catch (err) {
    errors.unknown = true;
    res.status(500).send(errors);
  }
});
module.exports = router;
