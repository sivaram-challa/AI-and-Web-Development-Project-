const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/users', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
});

const User = mongoose.model('User', UserSchema);

app.post('/signup', async (req, res) => {
  const { email, username, password } = req.body;
  const user = new User({ email, username, password });
  await user.save();
  res.status(201).send({ message: 'User created' });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    res.send({ message: 'Login successful', user: { username: user.username, email: user.email } });
  } else {
    res.status(401).send({ message: 'Invalid credentials' });
  }
});

app.post('/predict', async (req, res) => {
  const { symptoms } = req.body;

  try {
    const response = await axios.post('http://localhost:5000/predict', { symptoms });
    res.json(response.data);
  } catch (error) {
    res.status(500).send({ message: 'Error making prediction', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
