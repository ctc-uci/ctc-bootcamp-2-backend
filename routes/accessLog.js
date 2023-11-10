const express = require('express');
const { keysToCamel } = require('../common/utils');
const { db } = require('../server/db');

const accessLogRouter = express.Router();

accessLogRouter.get('/', async (req, res) => {
  try {
    const data = await db.query(`SELECT * FROM data_access_log;`);
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = accessLogRouter;
