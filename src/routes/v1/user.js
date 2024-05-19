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

router.patch('/profile', auth, async (req, res) => {
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
    Object.keys(req.body).forEach(
      (field) => (req.authenticatedUser[field] = req.body[field])
    );
    await req.authenticatedUser.save();
    return res.status(200).json(req.authenticatedUser);
  } catch (e) {
    if (e.errorResponse.code === 11000)
      return res.status(400).json({ message: 'Email is already taken' });
    return res.status(500).json(e);
  }
});
router.delete('/profile', auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.authenticatedUser._id);
    return res.status(200).json(req.authenticatedUser);
  } catch (e) {
    return res.status(500).json(e);
  }
});

module.exports = router;
