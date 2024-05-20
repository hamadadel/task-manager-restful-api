const router = require('express').Router();
const { Task } = require('../../models');
const auth = require('../../middlewares/auth');
const { toBoolean } = require('validator');

router.get('/', auth, async (req, res) => {
  const { completed } = req.query;
  const match = {};
  if (completed) {
    match.completed = toBoolean(completed);
  }
  console.log(match.completed);
  try {
    await req.authenticatedUser.populate({
      path: 'tasks',
      match,
    });
    // const tasks = await Task.find({
    // owner: req.authenticatedUser._id,
    // });
    return res.status(200).json(req.authenticatedUser.tasks);
  } catch (e) {
    return res.status(500).json(e);
  }
});
/**
 * Try Catch to handel individual errors from individual promises
 */
router.post('/', auth, async (req, res) => {
  try {
    const task = await new Task({
      ...req.body,
      owner: req.authenticatedUser._id,
    }).save();
    return task ? res.status(201).json(task) : res.status(400).send();
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.authenticatedUser._id,
    });
    return !task ? res.status(403).json() : res.status(200).json(task);
  } catch (e) {
    return res.status(500).json(e);
  }
});

router.patch('/:id', auth, async (req, res) => {
  const isValidRequest = Object.keys(req.body).every(
    (key) => 'description completed'.indexOf(key) >= 0
  );
  try {
    if (!isValidRequest)
      return res
        .status(400)
        .json({ message: 'Request body has invalid fields' });
    if (!Object.keys(req.body).length)
      return res.status(400).json({ message: 'no request body' });

    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.authenticatedUser._id,
    });
    if (!task) return res.status(403).json();
    Object.keys(req.body).forEach((field) => (task[field] = req.body[field]));
    await task.save();
    if (task) return res.status(200).json(task);
    return res.status(404).json({ message: 'Task not found' });
  } catch (e) {
    return res.status(500).json(e);
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.authenticatedUser._id,
    });
    return task ? res.status(200).json(task) : res.status(403).json();
  } catch (e) {
    return res.status(500).json(e);
  }
});

module.exports = router;
