const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const dbName = process.env.DB_NAME;

module.exports = {
  getDbConnectionParams: function() {
    const str = `mongodb+srv://${username}:${password}@cluster0.wh9zu9v.mongodb.net/?retryWrites=true&w=majority`;
    const params =  { dbName };
    return [str, params];
  }
}
