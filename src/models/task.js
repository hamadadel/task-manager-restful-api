require('./mongoose.js');

const { model } = require('mongoose');

const Task = model('Task', {
  description: {
    type: String,
    trim: true,
    require: true,
  },
  completed: {
    type: Boolean,
    require: true,
  },
});

const task = new Task({
  description: 'create new task model using mongoose',
  completed: true,
})
  .save()
  .then((task) => console.log(task))
  .catch((error) => console.log('Error', error));
