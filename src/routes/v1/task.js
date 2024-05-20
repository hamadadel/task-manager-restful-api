const router = require('express').Router();
const { Task } = require('../../models');
const auth = require('../../middlewares/auth');

router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({});
    return res.status(200).json(tasks);
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
    if (!task) return res.status(403);
    return res
      .status(200)
      .json(task)

      .catch((error) => res.status(500).json(error));
  } catch (e) {
    return res.status(404).json(e);
  }
});

router.patch('/:id', async (req, res) => {
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

    const task = await Task.findById(req.params.id);
    Object.keys(req.body).forEach((field) => (task[field] = req.body[field]));
    await task.save();
    if (task) return res.status(200).json(task);
    return res.status(404).json({ message: 'Task not found' });
  } catch (e) {
    return res.status(500).json(e);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (task) return res.status(200).json(task);
    return res.status(404).json({ message: 'Task not found' });
  } catch (e) {
    return res.status(500).json(e);
  }
});

const data = {
  completed: '',
  inCompleted: '',
};
router.get('/test/promise/chaining', async (req, res) => {
  const completedTasks = await Task.find({ completed: true });
  const inCompletedTasks = await Task.find({ completed: false });
  data.completed = completedTasks;
  data.inCompleted = inCompletedTasks;
  return res.json(data);
});

module.exports = router;
