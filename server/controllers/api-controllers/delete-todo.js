const Todos = require('../../models/todo-model');

module.exports = function(app) {
  app.delete('/api/todos/:todoID', function(req, res) {
    Todos.findByIdAndDelete({ _id: req.params.todoID },
      function(err, result) {
      if (err) throw err;
      res.send(result);
    });
  });
}
