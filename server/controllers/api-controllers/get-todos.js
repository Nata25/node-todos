const Todos = require('../../models/todo-model');

module.exports = function(app) {
  app.get('/api/todos', function(req, res) {
    const query = req.query;
    const sortingParams = {};
    if (Object.keys(query).includes('sort')) {
      const direction = !req.query.direction || req.query.direction === 'desc' ? -1 : 1;
      Object.assign(sortingParams, {[req.query.sort]: direction });
    }
    Todos.find().sort(sortingParams)
      .then(data => {
        res.send(data);
      })
      .catch(e => {
        console.log(e);
        throw e;
      });
  });
}
