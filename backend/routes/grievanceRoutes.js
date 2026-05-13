const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Grievance = require('../models/Grievance');

// Multer Setup for PDF Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

// @route   POST api/grievances
// @desc    Submit a new grievance
router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    console.log('Received Body:', req.body);
    console.log('Received File:', req.file);
    const { name, city, district, description, contact, category } = req.body;
    
    // Generate a unique Request ID (e.g., REQ-1234)
    const count = await Grievance.countDocuments();
    const requestID = `REQ-${8900 + count + 1}`;

    const newGrievance = new Grievance({
      requestID,
      name,
      city,
      district,
      description,
      contact,
      category,
      pdfUrl: req.file ? `/uploads/${req.file.filename}` : null
    });

    const grievance = await newGrievance.save();
    
    // Emit real-time event
    const io = req.app.get('socketio');
    if (io) {
      io.emit('newGrievance', grievance);
    }
    
    res.json(grievance);
  } catch (err) {
    console.error('Submission Error:', err);
    res.status(500).json({ 
      error: 'Server Error', 
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined 
    });
  }
});

// @route   GET api/grievances
// @desc    Get all grievances
router.get('/', async (req, res) => {
  try {
    const grievances = await Grievance.find().sort({ createdAt: -1 });
    res.json(grievances);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH api/grievances/:id
// @desc    Update grievance status
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const grievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    // Emit real-time event for status update
    const io = req.app.get('socketio');
    io.emit('updateGrievance', grievance);

    res.json(grievance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
