require('./models/mongoose');
const express = require('express');
const port = process.env.PORT || 3000;
const apiRoutes = require('./routes');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

app.listen(port, () =>
  console.log(`Server started at http://127.0.0.1:${port}`)
);
