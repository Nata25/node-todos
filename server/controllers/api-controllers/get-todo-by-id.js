const Todos = require('../../models/todo-model');
const Attachments = require('../../models/attachment-model');

module.exports = function(app) {
  app.get('/api/todos/:todoID', function(req, res) {
    // NOTE: todoDetails implements ITodoDetails interface
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
        return Attachments({ attachment: '' });
      }
    })
    .then(attachment => {
      if (attachment) {
        todoDetails.details = attachment.attachment.toString();
        todoDetails.originalFileName = attachment.metadata.originalname;
      } else if (attachment === null) {
        todoDetails.details = '[Attachment was deleted]';
      };
      res.send(todoDetails);
    })
    .catch(e => {
      console.log(e);
      throw e;
    });
  });
}
