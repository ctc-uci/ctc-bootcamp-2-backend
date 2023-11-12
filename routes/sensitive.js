const express = require('express');
const { db } = require('../server/db');

const sensitiveRouter = express.Router();

sensitiveRouter.get('/', async (req, res) => {
  try {
    const allSensitive = await db.query(`SELECT * from sensitive_data;`);
    res.send(allSensitive);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

sensitiveRouter.get('/:id', async (req, res) => {
  const sensitiveId = req.params.id;

  try {
    const sensitives = await db.query(`SELECT * from sensitive_data WHERE id = $1;`, [sensitiveId]);

    res.status(200).json(sensitives[0]);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = sensitiveRouter;