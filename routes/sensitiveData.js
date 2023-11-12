const express = require('express');
const { keysToCamel } = require('../common/utils');
const { db } = require('../server/db');

const sensitiveDataRouter = express.Router();

sensitiveDataRouter.get('/', async (req, res) => {
  try {
    const data = await db.query(`
    SELECT
      sensitive_data.id,
      sensitive_data.quote_text,
      sensitive_data.access_level,
      (first_name || ' ' || last_name) as quotee_name
    FROM
      sensitive_data
    LEFT JOIN user_info
      ON sensitive_data.quotee_id = user_info.id
    ;
    `);
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});
sensitiveDataRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sensitiveData = await db.query(
      `
      SELECT DISTINCT
        sensitive_data.id,
        sensitive_data.quote_text,
        sensitive_data.access_level,
        (user_info.first_name || ' ' || user_info.last_name) as quotee_name
      FROM
        user_access_level,
        sensitive_data
      LEFT JOIN user_info
        ON sensitive_data.quotee_id = user_info.id
      WHERE sensitive_data.id = $(id);
    `,
      { id },
    );
    res.status(200).json(keysToCamel(sensitiveData));
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = sensitiveDataRouter;
