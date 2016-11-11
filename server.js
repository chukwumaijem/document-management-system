'use strict';

// set local env reader
require('dotenv').config({ silent: true });

const express = require('express'),
  bodyParser = require('body-parser'),
  models = require('./app/models/dbconnect'),
  adminAuth = require('./app/middleware/adminAuth');

// import app routes
const homeRoute = require('./app/routes/index'),
  userRoutes = require('./app/routes/users'),
  roleRoutes = require('./app/routes/roles'),
  documentRoutes = require('./app/routes/documents');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// set up routes for the app
app.use('/', homeRoute);
app.use('/users', userRoutes);
app.use('/roles', adminAuth, roleRoutes);
app.use('/documents', documentRoutes);

// catch unknown routes
app.use(function (req, res) {
  res.json({
    status: 404,
    message: 'Requested route does not exist yet. Check back later. :wink:'
  });
});

//set app port
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