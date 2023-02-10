const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const attachmentSchema = new Schema({
  todoID: String,
  attachment: Buffer,
  metadata: {
    originalname: String,
    encoding: String,
    mimetype: String,
    path: String,
    size: String,
  }
});

const Attachments = mongoose.model('Attachments', attachmentSchema);

module.exports = Attachments;

