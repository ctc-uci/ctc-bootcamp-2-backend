const express = require('express');
const { db } = require('../server/db');

const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
  try {
    const allSensitive = await db.query(`SELECT * from sensitive_data;`);
    res.send(allSensitive);
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

<<<<<<< HEAD
module.exports = userRouter;
=======
module.exports = sensitiveRouter;
>>>>>>> 2b98e3b25ecb753f4ca69e90305c315d6394de25
