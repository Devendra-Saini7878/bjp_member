const mongoose = require('mongoose');

const GrievanceSchema = new mongoose.Schema({
  requestID: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  contact: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Public Grievance', 'Party Matter', 'Personal', 'Invitation', 'Other'],
    default: 'Public Grievance'
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'High Priority'],
    default: 'Pending'
  },
  pdfUrl: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Grievance', GrievanceSchema);
