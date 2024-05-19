const router = require('express').Router();
const auth = require('../../middlewares/auth');
const { User } = require('../../models');

router.get('/profile', auth, async (req, res) => {
  try {
    return res.status(200).json(req.authenticatedUser);
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
  try {
    if (!isValidRequest)
      return res
        .status(400)
        .json({ message: 'Request body has invalid fields' });
    if (!Object.keys(req.body).length)
      return res.status(400).json({ message: 'no request body' });
    const user = await User.findById(req.params.id);
    Object.keys(req.body).forEach((field) => (user[field] = req.body[field]));
    await user.save();
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
