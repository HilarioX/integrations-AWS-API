require('dotenv').config();

const cors = require('cors');
const uuid = require('uuid');
const express = require('express');
const UserRepository = require('./database/repositories/UserRepository');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/user', async (req, res) => {
  const { email, name } = req.body;
  const id = uuid.v4();

  const { Attributes } = await UserRepository.create({ id, email, name });

  return res.status(201).json({ user: Attributes });
});

app.get('/users', async (req, res) => {
  const { Items } = await UserRepository.list();

  return res.status(200).json({ users: Items });
});

app.listen(3333, () => console.log('app listening on http://localhost:3333'));
