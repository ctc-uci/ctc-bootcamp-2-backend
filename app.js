const express = require('express');
const cors = require('cors');

require('dotenv').config();

// routes
const user = require('./routes/user');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}`,
  }),
);

app.use('/user', user);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
