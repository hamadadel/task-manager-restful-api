const router = require('express').Router();
const User = require('../../models/user');
const auth = require('../../middlewares/auth');

router.post('/login', async (req, res) => {
  try {
    if (!req.body.email || !req.body.password)
      return res.status(400).json({ message: 'Missing Email or Password' });

    const user = await User.authenticate(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    return res.json({ user, token });
  } catch (e) {
    return res.status(400).json({ error: 'wrong credentials' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const user = await new User(req.body).save();
    const token = await user.generateAuthToken();
    return res.status(201).json({ user, token });
  } catch (e) {
    if (e.errorResponse.code === 11000)
      return res.status(400).json({ message: 'Email is already taken' });
    res.status(400).json(e);
  }
});

router.post('/logout', auth, async (req, res) => {
  try {
    req.authenticatedUser.tokens = req.authenticatedUser.tokens.filter(
      (token) => token.token !== req._token
    );
    await req.authenticatedUser.save();
    return res.status(200).json();
  } catch (e) {
    return res.status(500).json(e);
  }
});

router.post('/logout/all', auth, async (req, res) => {
  try {
    if (req._token) {
      req.authenticatedUser.tokens = [];
      await req.authenticatedUser.save();
      return res
        .status(200)
        .json({ message: 'you logged out from all devices' });
    }
  } catch (e) {
    return res.status(500).json(e);
  }
});
module.exports = router;
