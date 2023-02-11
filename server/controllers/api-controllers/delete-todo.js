const Todos = require('../../models/todo-model');
const Attachments = require('../../models/attachment-model');

module.exports = function(app) {
  app.delete('/api/todos/:todoID', function(req, res) {
    const todoID = req.params.todoID;
    Todos.findByIdAndDelete({ _id: todoID })
      .then(() => {
        return Attachments.findOneAndDelete({ todoID })
      })
      .then(result => {
        res.send(result);
      })
      .catch(e => {
        console.log(e);
        throw e;
      });
  });
}