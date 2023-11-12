const express = require('express');
const { keysToCamel } = require('../common/utils');
const { db } = require('../server/db');

const logsRouter = express.Router();

logsRouter.get('/', async (req, res) => {
  try {
    const allLogs = await db.query(`SELECT * from data_access_log;`);
    res.status(200).json(keysToCamel(allLogs));
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = logsRouter;
