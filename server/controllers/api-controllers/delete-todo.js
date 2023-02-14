const Todos = require('../../models/todo-model');
const Attachments = require('../../models/attachment-model');

module.exports = function(app) {
  app.delete('/api/todos/:todoID', function(req, res) {
    const todoID = req.params.todoID;
    let todoDeleted = {};
    Todos.findById({ _id: todoID })
      .then(data => {
        todoDeleted = data;
        return data.delete();
      })
      .then(() => Attachments.findOneAndDelete({ todoID }))
      .then(() => {
        res.send(todoDeleted);
      })
      .catch(e => {
        console.log(e);
        throw e;
      });
  });
}
