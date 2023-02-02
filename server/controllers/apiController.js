const bodyParser = require('body-parser');

const Todos = require('../models/todoModel');

module.exports = function(app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  app.get('/api/todos', function(req, res) {
    Todos.find(function(err, todos) {
      if (err) throw err;
      res.send(todos);
    });
  });

  app.get('/api/todos/users/:user', function(req, res) {
    Todos.find({
      username: req.params.user,
    }, function(err, todos) {
      if (err) throw err;
      res.send(todos);
    });
  });

  app.get('/api/todos/:todoID', function(req, res) {
    Todos.findById({
      _id: req.params.todoID,
    }, function(err, todo) {
      if (err) throw err;
      res.send(todo);
    });
  });

  app.post('/api/todos', function(req, res) {
    const newTodo = Todos({
      todo: req.body.todo,
      username: req.body.username,
      isDone: req.body.isDone,
    });
    newTodo.save(function(err, result) {
      if (err) throw err;
      res.send(result);
    });
  });

  app.put('/api/todos', function(req, res) {
    Todos.findByIdAndUpdate({ _id: req.body._id },
      {
        todo: req.body.todo,
        username: req.body.username,
        isDone: req.body.isDone,
      }, function(err, result) {
      if (err) throw err;
      res.send(result);
    });
  });

  app.delete('/api/todos/:todoID', function(req, res) {
    Todos.findByIdAndDelete({
      _id: req.params.todoID,
    }, function(err, result) {
      if (err) throw err;
      res.send(result);
    });
  });
}
