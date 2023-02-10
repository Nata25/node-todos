const Todos = require('../../models/todo-model');

module.exports = function(app) {
  app.put('/api/todos/:todoID', async function(req, res) {
    const _id = req.params.todoID;
    const { todo, username, isDone } = req.body;
    Todos.findById({ _id })
      .then(data => {
        data.todo = todo || data.todo;
        data.username = username || data.username;
        data.isDone = isDone || data.isDone;
        return data.save();
      })
      .then(result => {
        res.send(result);
      })
      .catch (e => {
        console.log(e);
        throw e;
      });
  });
}
