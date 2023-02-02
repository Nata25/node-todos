const express = require('express');
const app = express();
const mongoose = require('mongoose');

const config = require('./config');
const setupTodos = require('./controller/setupController');
const todosApi = require('./controller/apiController');

app.use('/assets', express.static(`${__dirname}/public`));
app.set('view engine', 'ejs');

mongoose.connect(config.getDbConnectionString(), {dbName: 'node'});
setupTodos(app);
todosApi(app);

app.listen(3000);


