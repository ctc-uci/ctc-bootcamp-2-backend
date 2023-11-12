const express = require('express');
const { keysToCamel } = require('../common/utils');
const { db } = require('../server/db');

const sensitiveRouter = express.Router();

sensitiveRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // const whereClause = id ? `WHERE id = ${id}` : '';
    const allSensitive = await db.query(
      `select SD.id, quote_text, first_name || ' ' || last_name as quotee_name, access_level from sensitive_data SD
      inner join user_info UI on SD.quotee_id = UI.id
      where SD.id = $1`,
      [id],
    );
    res.status(200).json(keysToCamel(allSensitive));
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

sensitiveRouter.get('/', async (req, res) => {
  try {
    const allSensitive = await db.query(
      `SELECT sensitive_data.id, sensitive_data.quote_text, user_info.first_name || ' ' || user_info.last_name AS quotee_name, sensitive_data.access_level from sensitive_data JOIN user_info ON sensitive_data.quotee_id = user_info.id;`,
    );
    res.status(200).json(keysToCamel(allSensitive));
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = sensitiveRouter;
