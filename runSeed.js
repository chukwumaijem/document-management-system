'use strict';

require('dotenv').config({ silent: true });
const models = require('./app/models/dbconnect');

models.sequelize.sync({ logging: false })
  .then(() => {
    require('./seedData')(models);
  })
  .catch((err) => {
    throw new Error(err.message);
  });