require('./models/mongoose');
const express = require('express');
const port = process.env.PORT || 3000;

const { User, Task } = require('./models');
const app = express();

app.use(express.json());

/**
 * Users Endpoints
 */
app.post('/api/v1/users', (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then(() => res.status(201).json(user))
    .catch((error) => res.status(400).json(error));
});

app.get('/api/v1/users', (req, res) =>
  User.find({})
    .then((users) => res.status(200).json(users))
    .catch((error) => res.status(500).json(error))
);
app.get('/api/v1/users/:id', (req, res) =>
  User.findById(req.params.id)
    .then((user) =>
      user
        ? res.status(200).json(user)
        : res.status(400).json({ message: 'User not found' })
    )
    .catch((error) => res.status(500).json(error))
);
/**
 * Tasks Endpoints
 */
app.get('/api/v1/tasks', (req, res) =>
  Task.find({})
    .then((tasks) => res.status(200).json(tasks))
    .catch((error) => res.status(500).json(error))
);
app.post('/api/v1/tasks', (req, res) => {
  const task = new Task(req.body);
  task
    .save()
    .then(() => res.status(201).json(task))
    .catch((error) => res.status(400).json(error));
});

app.get('/api/v1/tasks/:id', (req, res) =>
  Task.findById(req.params.id)
    .then((task) =>
      task
        ? res.status(200).json(task)
        : res.status(400).json({ message: 'Task not found' })
    )
    .catch((error) => res.status(500).json(error))
);
app.listen(port, () =>
  console.log(`Server started at http://127.0.0.1:${port}`)
);
