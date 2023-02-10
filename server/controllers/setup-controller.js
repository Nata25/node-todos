const Todos = require('../models/todo-model');
const staredTodos = require('../data/todos-seed');

module.exports = function (app) {
  app.get('/api/todos/setup', function(req, res) {    
    Todos.create(staredTodos, function(err, result) {
      if (err) throw err;
      res.send(result);
    });
  });
}
