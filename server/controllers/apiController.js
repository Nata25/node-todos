const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');

const Todos = require('../models/todoModel');
const Attachments = require('../models/attachmentModel');

const upload = multer({ dest: 'uploads/' });

module.exports = function(app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

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
    }).then(data => {
      const todoDetails = {
        todo: data.todo,
        isDone: data.isDone,
        hasAttachment: data.hasAttachment,
        username: data.username,
      };
      if (data.hasAttachment) {
        Attachments.findOne({
          todoID: data._id,
        }, function (err, result) {
          if (err) throw err;
          todoDetails.details = result.attachment.toString();
          res.send(todoDetails);
        });
      } else {
        todoDetails.details = '';
        res.send(todoDetails);
      }
    })
    .catch(e => {
      throw e;
    });
  });

  app.post('/api/todos', upload.single('attachment'), function(req, res) {
    const { todo, username, isDone } = req.body;
    let savedTodo = {};
    const newTodo = Todos({
      todo,
      username,
      isDone,
      hasAttachment: Boolean(req.file),
    });
    // save todo
    newTodo.save()
      .then(data => {
        if (!req.file) {
          res.send(data);
          return;
        }
        const { path, originalname, encoding, mimetype, size } = req.file;
        fs.readFile(path, async function(err, file) {
          if (err) throw err;
          const details = file.toString('utf-8');
          savedTodo = {
            ...savedTodo,
            details,
          }
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
          await newAttachment.save();
          res.send(data);
        });
      })
      .catch(e => {
        throw e;
      });
  });

  app.put('/api/todos', upload.single('attachment'), function(req, res) {
    const { todo, username, isDone, _id } = req.body;
    Todos.findByIdAndUpdate({ _id },
      {
        todo,
        username,
        isDone,
      }, function(err, result) {
      if (err) throw err;
      res.send(result);
    });
  });

  app.put('/api/todos/:todoID', async function(req, res) {
    const _id = req.params.todoID;
    const { todo, username, hasAttachment, isDone } = req.body;
    try {
      return await Todos.findById({ _id })
      .then(data => {
        data.todo = todo || data.todo;
        data.username = username || data.username;
        data.isDone = isDone || data.isDone;
        data.hasAttachment = hasAttachment || data.hasAttachment;
        data.save(function(err, result) {
          if (err) throw err;
          res.send(result);
        });
      });
    }
    catch (err) {
      throw err;
    }
  });

  app.delete('/api/todos/:todoID', function(req, res) {
    Todos.findByIdAndDelete({ _id: req.params.todoID },
      function(err, result) {
      if (err) throw err;
      res.send(result);
    });
  });

  app.get('/api/attachments/:todoID', function(req, res) {
    Attachments.findOne({
      todoID: req.params.todoID
    }, function(err, result) {
      if (err) throw err;
      res.send(result);
    })
  });
}
