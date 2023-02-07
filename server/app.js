const express = require('express');
const app = express();
const mongoose = require('mongoose');

const config = require('./config');
const setupTodos = require('./controllers/setupController');
const todosApi = require('./controllers/apiController');

app.use('/', express.static(`${__dirname}/client`));

mongoose.connect(...config.getDbConnectionParams());
setupTodos(app);
todosApi(app);

app.listen(3000);


