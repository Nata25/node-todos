const Todos = require('../../models/todo-model');

module.exports = function(app) {
  app.get('/api/todos', function(req, res) {
    Todos.find(function(err, todos) {
      if (err) throw err;
      res.send(todos);
    });
  });
}
