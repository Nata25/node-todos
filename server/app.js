const express = require('express');
const app = express();
const mongoose = require('mongoose');

const config = require('./config');
const setupTodos = require('./controllers/setup-controller');
const todosApi = require('./controllers/api-controllers');

app.use('/', express.static(`${__dirname}/client`));

mongoose.connect(...config.getDbConnectionParams());
setupTodos(app);
todosApi(app);

app.listen(3000);


