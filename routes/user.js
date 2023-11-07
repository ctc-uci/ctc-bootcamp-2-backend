const express = require('express');
const { keysToCamel } = require('../common/utils');
const { db } = require('../server/db');

const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
  try {
    const allUsers = await db.query(`SELECT * from user_info;`);
    res.status(200).json(keysToCamel(allUsers));
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = userRouter;
