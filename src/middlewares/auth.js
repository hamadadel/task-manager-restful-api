const { verify } = require('jsonwebtoken');
const { User } = require('../models');

async function auth(req, res, next) {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = verify(token, 'secret_key');
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });
    if (!user) {
      throw new Error('Unauthorized');
    }
    req._token = token;
    req.authenticatedUser = user;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

module.exports = auth;
