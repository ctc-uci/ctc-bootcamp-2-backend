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

userRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.query(`SELECT * from user_info WHERE id = $1;`, [id]);
    res.status(200).json(keysToCamel(user));
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = userRouter;
