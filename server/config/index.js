const configValues = require('./config.json');

module.exports = {
  getDbConnectionString: function() {
    return `mongodb+srv://${configValues.uname}:${configValues.pwd}@cluster0.wh9zu9v.mongodb.net/${configValues['db-name']}/?retryWrites=true&w=majority`;
  }
}
