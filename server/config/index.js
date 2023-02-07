const configValues = require('./config.json');

module.exports = {
  getDbConnectionParams: function() {
    const str = `mongodb+srv://${configValues.uname}:${configValues.pwd}@cluster0.wh9zu9v.mongodb.net/?retryWrites=true&w=majority`;
    const params =  { dbName: configValues['db-name'] };
    return [str, params];
  }
}
