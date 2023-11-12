const express = require('express');
// const { keysToCamel } = require('../common/utils');
const { db } = require('../server/db');

const sensitiveRouter = express.Router();

sensitiveRouter.get('/:id', async (req, res) => {
  const sensitiveId = req.params.id;

  try {
    const sensitives = await db.query(`SELECT * from sensitive_data WHERE id = ${sensitiveId};`);

    res.status(200).json(sensitives[0].quote_text);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = sensitiveRouter;
