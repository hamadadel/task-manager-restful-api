async function auth(req, res, next) {
  console.log('Authentication middleware');
  next();
}

module.exports = auth;
