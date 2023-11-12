const express = require('express');
const { db } = require('../server/db');

const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
  try {
    const allSensitive = await db.query(`SELECT * from sensitive_data;`);
    res.send(allSensitive);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = userRouter;
