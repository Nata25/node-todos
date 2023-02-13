const fs = require('fs');

const Todos = require('../../models/todo-model');
const Attachments = require('../../models/attachment-model');

module.exports = function(app, upload) {
  app.post('/api/todos', upload.single('attachment'), function(req, res) {
    const todoDTO = {
      todo: {},
      attachment: {},
    };
    const { todo, username, dueDate, isDone } = req.body;
    const newTodo = Todos({
      todo,
      username,
      isDone,
      dueDate,
      createdDate: new Date(),
      hasAttachment: Boolean(req.file),
    });
    newTodo.save()
      .then(data => {
        todoDTO.todo = data;
        if (!req.file) {
          return null; // NOTE: need to return null if todo has no file to differentiate logic in the upcoming chain
        }
        const { path, originalname, encoding, mimetype, size } = req.file;
        return new Promise((resolve, reject) => {
          fs.readFile(path, function(err, file) {
            if (err) reject(err);
            const details = file.toString('utf-8');
            const newAttachment = Attachments({
              todoID: data._id,
              metadata: {
                originalname,
                encoding,
                mimetype,
                path,
                size,
              },
              attachment: details,
            });
            resolve(newAttachment);
          });
        });
      })
      .then(newAttachment => {
        if (newAttachment !== null) {
          return newAttachment.save();
        } else return null;
      })
      .then(data => {
        if (data !== null) {
          todoDTO.attachment = data;
        }
        res.send(todoDTO);
      })
      .catch(e => {
        console.log(e);
        throw e;
      });
  });
}
