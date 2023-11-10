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

userRouter.get('/culprit', async (req, res) => {
  try {
    const culprits = await db.query(`
      SELECT ARRAY_AGG(uid) as culprits FROM (
        SELECT DISTINCT
          user_info.id as uid
        FROM user_info
        INNER JOIN user_access_level
          ON user_info.id = user_access_level.id
        INNER JOIN data_access_log
          ON user_info.id = data_access_log.user_id
        INNER JOIN sensitive_data
          ON user_info.id = sensitive_data.quotee_id AND
            data_access_log.sensitive_data_id = sensitive_data.id
        WHERE
          user_access_level.access_level < sensitive_data.access_level
      ) as user_ids
    `);
    res.status(200).json(keysToCamel(culprits));
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

userRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.query(
      `
      SELECT
        user_info.id,
        user_info.last_name,
        user_info.first_name,
        user_info.title,
        user_profile_image.url,
        user_access_level.access_level,
        data_access_by_user.accessed_data
      FROM user_info
      INNER JOIN user_profile_image
        ON user_info.id = user_profile_image.id
      INNER JOIN user_access_level
        ON user_info.id = user_access_level.id
      INNER JOIN (
        SELECT
          user_id,
          ARRAY_AGG(json_build_object('id', id, 'access_time', access_time, 'sensitive_data_id', sensitive_data_id)) as accessed_data
        FROM data_access_log
        GROUP BY user_id
      ) AS data_access_by_user
        ON user_info.id = data_access_by_user.user_id
      WHERE user_info.id = $(id);
    `,
      { id },
    );
    res.status(200).json(keysToCamel(user));
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = userRouter;
