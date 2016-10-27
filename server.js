const express = require('express'),
  bodyParser = require('body-parser');


// set local env reader
require('dotenv').config({ silent: true });

global.Sequelize = require('sequelize');
global.sequelize = new Sequelize(process.env.database, process.env.dbusername, process.env.dbpassword, {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

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
app.use('/roles', roleRoutes);
app.use('/documents', documentRoutes);

// catch unknown routes
app.use(function (req, res) {
  res.json({
    status: 404,
    message: 'Requested route does not exist yet. Check back later. :wink:'
  });
});

//set app port
let port = process.env.PORT;


sequelize.authenticate()
  .then(function () {
    console.log('Database is connected...');
    app.listen(port, (err) => {
      if (!err) {
        console.log(`App started on port: ${port}...`);
      };
    });
  })
  .catch(function (err) {
    console.log('Unable to connect to database');
  });

// export app for supertest testing
module.exports = app;