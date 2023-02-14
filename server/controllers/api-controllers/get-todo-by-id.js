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
        return 404;
      } else {
        todoDetails = {
          _id: data._id,
          todo: data.todo,
          isDone: data.isDone,
          hasAttachment: data.hasAttachment,
          username: data.username,
          dueDate: data.dueDate,
          createdDate: data.createdDate,
        };
        if (data.hasAttachment) {
          return Attachments.findOne({
            todoID: data._id,
          });
        } else {
          return Attachments({ attachment: '' });
        }
      }
    })
    .then(data => {
      if (data === 404) {
        // NOTE: Todo not found scenario
        res.sendStatus(404);
      } else {
        if (data) {
          // NOTE: normal flow
          todoDetails.details = data.attachment.toString();
          todoDetails.originalFileName = data.metadata.originalname;
        } else if (data === null) {
          // NOTE: non common case of deleted attachment without modifying todo.hasAttachment property
          todoDetails.details = '[Attachment was deleted]';
        };
        res.send(todoDetails);
      }
    })
    .catch(e => {
      console.log(e);
      throw e;
    });
  });
}
