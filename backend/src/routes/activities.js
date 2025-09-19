import express from 'express';
import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  category: String,
  semester: Number,
  credits: Number,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  submittedAt: String,
  reviewedAt: String,
  reviewedBy: String,
  reviewComments: String
});
const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);

const router = express.Router();

// Get all activities
router.get('/', async (req, res) => {
  const activities = await Activity.find();
  res.json(activities);
});

// Add new activity
router.post('/', async (req, res) => {
  try {
    const activity = new Activity(req.body);
    await activity.save();
    res.status(201).json(activity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update activity
router.put('/:id', async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(activity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete activity
router.delete('/:id', async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ message: 'Activity deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
