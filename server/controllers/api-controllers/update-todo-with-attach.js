const fs = require('fs');

const Todos = require('../../models/todo-model');
const Attachments = require('../../models/attachment-model');

module.exports = function(app, upload) {
  app.put('/api/todos', upload.single('attachment'), function(req, res) {
    const todoDTO = {
      todo: {},
      attachment: {},
    };
    const { todo, username, isDone, _id } = req.body;
    const hasAttachment = Boolean(req.file);
    Todos.findByIdAndUpdate({ _id }, {
      todo,
      username,
      isDone,
      hasAttachment,
    })
    .then(data => {
      todoDTO.todo = data;
      if (!req.file) {
        return;
      }
      return Attachments.findOne({ todoID: data._id });
    })
    .then(attachmentObj => {
      if (attachmentObj === null && req.file) {
        /* NOTE: if there's a file uploaded but no file in DB is associated with todo:
        need to create */
        const { path, originalname, encoding, mimetype, size } = req.file;
        const newAttachment = new Attachments({
          todoID: _id,
          metadata: {
            originalname,
            encoding,
            mimetype,
            path,
            size,
          },
          attachment: '' // will be added on the next chain step
        });
        return new Promise(function(resolve, reject) {
          fs.readFile(req.file.path, function(err, file) {
            if (err) reject(err);
            newAttachment.attachment = file.toString();
            resolve(attachmentObj);
          });
        });
      } else if (attachmentObj !== null && req.file) {
        /* NOTE: if there's attachment in DB associated with todo and we have new attachment uploaded via form:
        need  to replace */
        return new Promise(function(resolve, reject) {
          fs.readFile(req.file.path, function(err, file) {
            if (err) reject(err);
            attachmentObj.attachment = file.toString();
            resolve(attachmentObj);
          });
        });
      } else return null; // we don't work with files in this case;
    })
    .then(result => {
      if (result !== null) {
        return result.save();
      }
      return null;
    })
    .then(savedAttachment => {
      if (savedAttachment) {
        todoDTO.attachment = savedAttachment;
      }
      res.send(todoDTO);
    })
    .catch(e => {
      console.log(e);
      throw e;
    });
  });
}
