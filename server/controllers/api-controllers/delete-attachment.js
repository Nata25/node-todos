const Todos = require('../../models/todo-model');
const Attachments = require('../../models/attachment-model');

module.exports = function(app) {
  app.delete('/api/attachments/:todoID', function(req, res) {
    const todoID = req.params.todoID;
    Attachments.findOneAndDelete({ todoID })
      .then(() => {
        return Todos.findOneAndUpdate({ _id: todoID }, {
          hasAttachment: false,
        })
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
