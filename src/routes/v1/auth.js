const router = require('express').Router();
const User = require('../../models/user');

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
  } catch (error) {
    res.status(400).json(error);
  }
});
module.exports = router;
