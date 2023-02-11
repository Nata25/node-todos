// global modules
const bodyParser = require('body-parser');
const multer = require('multer');

// controllers
const getTodos = require('./get-todos');
const getTodoById = require('./get-todo-by-id');
const createNewTodo = require('./create-new-todo');
const updateTodo = require('./update-todo');
const updateTodoWithAttach = require('./update-todo-with-attach');
const deleteTodo = require('./delete-todo');
const deleteAttachment = require('./delete-attachment');

const upload = multer({ dest: 'uploads/' });

module.exports = function(app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // api methods
  getTodos(app);
  getTodoById(app);
  updateTodo(app);
  createNewTodo(app, upload);
  updateTodoWithAttach(app, upload);
  deleteTodo(app);
  deleteAttachment(app);
}
