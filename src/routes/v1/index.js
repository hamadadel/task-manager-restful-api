const router = require('express').Router();
const userRoutes = require('./user');
const taskRoutes = require('./task');

router.use('/users', userRoutes);
router.use('/tasks', taskRoutes);

module.exports = router;
