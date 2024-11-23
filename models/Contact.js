const mongoose = require('mongoose');
const contactSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
});

module.exports = mongoose.model('Contact', contactSchema);
