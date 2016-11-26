import {} from 'dotenv/config';
import models from './app/models/dbconnect';

models.sequelize.sync({ logging: false })
  .then(() => {
    require('./seedData')(models);
  })
  .catch((err) => {
    throw new Error(err.message);
  });
