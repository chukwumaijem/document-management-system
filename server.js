import {} from 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import models from './app/models/dbconnect';
import adminAuth from './app/middleware/adminAuth';

// import app routes
import homeRoute from './app/routes/index';
import userRoutes from './app/routes/users';
import roleRoutes from './app/routes/roles';
import documentRoutes from './app/routes/documents';


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// set up routes for the app
app.use('/', homeRoute);
app.use('/users', userRoutes);
app.use('/roles', adminAuth, roleRoutes);
app.use('/documents', documentRoutes);

// catch unknown routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Requested route does not exist yet. Check back later. :wink:'
  });
});

app.use((err, req, res, next) => {
  console.log(`error: ${err.message}`);
  res.status(err.code || 500).json({ error: err.reason });
});

// set app port
const port = process.env.PORT || 3000;
models.sequelize.sync({ logging: false })
  .then(() => {
    app.listen(port, (err) => {
      if (!err) {
        console.log(`App started on port: ${port}...`);
      }
    });
  });

// export app for supertest testing
module.exports = app;
