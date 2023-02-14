const express = require('express');
const mongoose = require('mongoose');

const setCache = require('./middlewares/set-cache');
const config = require('./config');
const setupTodos = require('./controllers/setup-controller');
const todosApi = require('./controllers/api-controllers');

const app = express();
setCache(app);

mongoose.connect(...config.getDbConnectionParams());
setupTodos(app);
todosApi(app);

app.listen(3000);
