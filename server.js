// set local env reader
require('dotenv').config({ silent: true });

const express = require('express');
const bodyParser = require('body-parser');
const models = require('./app/models/dbconnect');
const adminAuth = require('./app/middleware/adminAuth');

// import app routes
const homeRoute = require('./app/routes/index');
const userRoutes = require('./app/routes/users');
const roleRoutes = require('./app/routes/roles');
const documentRoutes = require('./app/routes/documents');

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
