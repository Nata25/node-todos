const Todos = require('../../models/todo-model');
const Attachments = require('../../models/attachment-model');

module.exports = function(app) {
  app.get('/api/todos/:todoID', function(req, res) {
    let todoDetails = {};
    Todos.findById({
      _id: req.params.todoID,
    })
    .then(data => {
      if (data === null) {
        res.sendStatus(404);
        return;
      }
      todoDetails = {
        _id: data._id,
        todo: data.todo,
        isDone: data.isDone,
        hasAttachment: data.hasAttachment,
        username: data.username,
      };
      if (data.hasAttachment) {
        return Attachments.findOne({
          todoID: data._id,
        });
      } else {
        return { attachment: '' };
      }
    })
    .then(result => {
      if (result) {
        todoDetails.details = result.attachment.toString();
      } else if (result === null) {
        todoDetails.details = '[Attachment was deleted]';
      } else return;
      res.send(todoDetails);
    })
    .catch(e => {
      console.log(e);
      throw e;
    });
  });
}
