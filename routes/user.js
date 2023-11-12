const express = require('express');
const { keysToCamel } = require('../common/utils');
const { db } = require('../server/db');

const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
  try {
    const allUsers = await db.query(`SELECT * from user_info;`);
    res.status(200).json(keysToCamel(allUsers));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

userRouter.get('/culprit', async (req, res) => {
  try {
    const culpritData = await db.query(`
    SELECT DISTINCT
      CONCAT(user_info.first_name, ' ', user_info.last_name) AS name, sensitive_data.id
    FROM user_info
    INNER JOIN data_access_log ON user_info.id = data_access_log.user_id
    INNER JOIN user_access_level ON user_info.id = user_access_level.id
    INNER JOIN sensitive_data ON data_access_log.sensitive_data_id = sensitive_data.id
    WHERE user_access_level.access_level < sensitive_data.access_level;
    `);
    // const formattedData = culpritData.map((entry) => ({
    //   name: entry.first_name + ' ' + entry.last_name,
    //   illegalDataAccessed: entry.quote_text,
    // }));

    // const formattedData = Object.values(
    //   culpritData.reduce((acc, entry) => {
    //     if (!acc[entry.name]) {
    //       acc[entry.name] = {
    //         name: entry.first_name + ' ' + entry.last_name,
    //         illegalDataAccessed: [entry.quote_text],
    //       };
    //     } else {
    //       acc[entry.name].illegalDataAccessed = acc[entry.name].illegalDataAccessed.concat(
    //         entry.illegalDataAccessed,
    //       );
    //     }
    //     return acc;
    //   }, {}),
    // );

    res.status(200).json(keysToCamel(culpritData));
  } catch (err) {
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
