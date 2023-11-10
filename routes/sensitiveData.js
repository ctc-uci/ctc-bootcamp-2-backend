const express = require('express');
const { keysToCamel } = require('../common/utils');
const { db } = require('../server/db');

const sensitiveDataRouter = express.Router();

sensitiveDataRouter.get('/', async (req, res) => {
  try {
    const data = await db.query(`SELECT * FROM sensitive_data;`);
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});
sensitiveDataRouter.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const sensitiveData = await db.query(
      `
      SELECT
        sensitive_data.id,
        sensitive_data.quote_text,
        sensitive_data.quotee_id,
        sensitive_data.access_level
      FROM user_access_level, sensitive_data
      WHERE
        user_access_level.access_level >= sensitive_data.access_level AND
        user_access_level.id = $(userId)
      ;
    `,
      { userId },
    );
    res.status(200).json(keysToCamel(sensitiveData));
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = sensitiveDataRouter;
