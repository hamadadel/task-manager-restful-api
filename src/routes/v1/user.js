const router = require('express').Router();
const { User } = require('../../models');
router.post('/', async (req, res) => {
  try {
    const user = await new User(req.body).save();
    return res.status(201).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json(error);
  }
});
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    return user
      ? res.status(200).json(user)
      : res.status(400).json({ message: 'User not found' });
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.patch('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) return res.status(200).json(user);
    return res.status(404).json({ message: 'User not found' });
  } catch (e) {
    return res.status(500).json(e);
  }
});

module.exports = router;
