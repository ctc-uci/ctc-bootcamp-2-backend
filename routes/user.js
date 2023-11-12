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
    const allCulprits =
      await db.query(`SELECT CONCAT(ui.first_name, ' ', ui.last_name) AS name, array_agg(DISTINCT sd.id) as illegal_data_accessed
    FROM data_access_log dl, sensitive_data sd, user_access_level ual, user_info ui
    WHERE dl.user_id = ual.id AND dl.user_id = ui.id AND dl.sensitive_data_id = sd.id
    AND ual.access_level < sd.access_level
    GROUP BY name;`);
    res.status(200).json(keysToCamel(allCulprits));
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

userRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.query(
      `SELECT
      sub.id,
		  sub.last_name,
		  sub.first_name,
		  sub.title,
		  sub.url,
		  sub.access_level,
      ARRAY_AGG(JSON_BUILD_OBJECT('id',sub.dal_id,'accessTime',sub.access_time,'sensitiveDataId',sub.sens_id)) AS accessed_data
    FROM (
	    SELECT
        ui.id AS id,
        ui.last_name AS last_name,
        ui.first_name AS first_name,
        ui.title AS title,
        upi.url AS url,
        ual.access_level AS access_level,
        dal.id AS dal_id,
        dal.access_time AS access_time,
        dal.sensitive_data_id AS sens_id
	    FROM user_info AS ui
      LEFT JOIN user_access_level AS ual on ui.id = ual.id
      LEFT JOIN user_profile_image AS upi on ui.id = upi.id
      LEFT JOIN data_access_log AS dal on ui.id = dal.user_id
      WHERE ui.id = $1
      ) AS sub
    GROUP BY sub.id, sub.last_name, sub.first_name, sub.title, sub.url, sub.access_level;`,
      [id],
    );
    res.status(200).json(keysToCamel(user));
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = userRouter;
