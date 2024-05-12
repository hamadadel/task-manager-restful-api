const express = require('express');
const port = process.env.PORT || 3000;

const User = require('./models/user');
const app = express();

app.use(express.json());

app.post('/api/v1/users', (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then(() =>
      res
        .status(201)
        .json({ message: 'user created successfully', data: user, error: null })
    )
    .catch((e) =>
      res
        .status(400)
        .json({ message: 'Unable create a user', data: null, error: e })
    );
});

app.listen(port, () =>
  console.log(`Server started at http://127.0.0.1:${port}`)
);
