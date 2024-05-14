require('./models/mongoose');
const express = require('express');
const port = process.env.PORT || 3000;

const { User, Task } = require('./models');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Users Endpoints
 */
app.post('/api/v1/users', async (req, res) => {
  try {
    const user = await new User(req.body).save();
    return res.status(201).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
});

app.get('/api/v1/users', async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json(error);
  }
});
app.get('/api/v1/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    return user
      ? res.status(200).json(user)
      : res.status(400).json({ message: 'User not found' });
  } catch (error) {
    return res.status(500).json(error);
  }
});

app.patch('/api/v1/users/:id', async (req, res) => {
  const isValidRequest = Object.keys(req.body).every(
    (key) => 'name email password'.indexOf(key) >= 0
  );
  console.log(isValidRequest);
  try {
    if (!isValidRequest)
      return res
        .status(400)
        .json({ message: 'Request body has invalid fields' });
    if (!Object.keys(req.body).length)
      return res.status(400).json({ message: 'no request body' });
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      fields: ['name', 'email', 'password'],
    });
    if (user) return res.status(200).json(user);
    return res.status(404).json({ message: 'User not found' });
  } catch (e) {
    return res.status(500).json(e);
  }
});
/**
 * Tasks Endpoints
 */
app.get('/api/v1/tasks', (req, res) =>
  Task.find({})
    .then((tasks) => res.status(200).json(tasks))
    .catch((error) => res.status(500).json(error))
);
/**
 * Try Catch to handel individual errors from individual promises
 */
app.post('/api/v1/tasks', async (req, res) => {
  try {
    const task = await new Task(req.body).save();
    return task ? res.status(201).json(task) : res.status(400).send();
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

app.get('/api/v1/tasks/:id', (req, res) =>
  Task.findById(req.params.id)
    .then((task) =>
      task
        ? res.status(200).json(task)
        : res.status(404).json({ message: 'Task not found' })
    )
    .catch((error) => res.status(500).json(error))
);

app.delete('/api/v1/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  console.log(task);
  if (task) {
    const count = await Task.countDocuments({ completed: false });
    return res
      .status(200)
      .json({ message: 'you have ' + count + 'inCompleted tasks' });
  }
  return res.status(404).json({ message: 'Task not found' });
});

app.patch('/api/v1/tasks/:id', async (req, res) => {
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
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
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
app.get('/test/promise/chaining', async (req, res) => {
  const completedTasks = await Task.find({ completed: true });
  const inCompletedTasks = await Task.find({ completed: false });
  data.completed = completedTasks;
  data.inCompleted = inCompletedTasks;
  return res.json(data);
});
app.listen(port, () =>
  console.log(`Server started at http://127.0.0.1:${port}`)
);
