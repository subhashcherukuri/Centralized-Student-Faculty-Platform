import express from 'express';
import mongoose from 'mongoose';

const academicsSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  records: [
    {
      semester: Number,
      sgpa: Number,
      attendance: Number
    }
  ],
  cgpa: Number,
  extraDetails: {
    backlogs: Number,
    awards: String,
    remarks: String
  }
});
const Academics = mongoose.models.Academics || mongoose.model('Academics', academicsSchema);

const router = express.Router();

// Get academics for a student
router.get('/:studentId', async (req, res) => {
  const academics = await Academics.findOne({ studentId: req.params.studentId });
  res.json(academics);
});

// Update academics for a student
router.put('/:studentId', async (req, res) => {
  try {
    const academics = await Academics.findOneAndUpdate(
      { studentId: req.params.studentId },
      req.body,
      { new: true, upsert: true }
    );
    res.json(academics);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
