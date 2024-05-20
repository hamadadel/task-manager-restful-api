require('./models/mongoose');
const express = require('express');
const port = process.env.PORT || 3000;
const apiRoutes = require('./routes');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

app.listen(port, () =>
  console.log(`Server started at http://127.0.0.1:${port}`)
);

// const { Task, User } = require('./models');

// const play = async function () {
//   const task = await Task.findById('664a1ca72903ad6b44ee7223');
//   // find the users who's associated with this task and
//   await task.populate('owner');
//   console.log(task.owner);
// };
// // play();

// const getUserTasks = async () => {
//   const user = await User.findById('664a1a834076dd2b541a8666');
//   await user.populate('tasks');
//   console.log(user.tasks);
// };
// getUserTasks();
