const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const crypto = require('crypto');
const cors = require('cors');
const loginValidation = require('./middlewares/loginValidation');
const authValidation = require('./middlewares/authValidation');
const nameValidation = require('./middlewares/nameValidation');
const ageValidation = require('./middlewares/ageValidation');
const { dateValidation, rateValidation, talkValidation } = require('./middlewares/talkValidation');

const talkerFile = './talker.json';

const app = express();
app.use(bodyParser.json());
app.use(cors());
const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker/search', authValidation, async (req, res) => {
  const { q } = req.query;
  const file = await fs.readFile(talkerFile);
  const content = JSON.parse(file);
  const filteredTalker = content.filter((i) => i.name.includes(q));
  if (filteredTalker.length < 1) return res.status(200).json(content);
  res.status(200).json(filteredTalker);
});

app.get('/talker', async (_req, res) => {
  const file = await fs.readFile(talkerFile);
  const content = JSON.parse(file);
  res.status(200).json(content);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const file = await fs.readFile(talkerFile);
  const content = JSON.parse(file);
  const talker = content.find((i) => i.id === Number(id));
  if (!talker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  res.status(200).json(talker);
});
app.post('/login', loginValidation, (req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  res.status(200).json({ token });
});

app.post('/talker',
  authValidation,
  nameValidation,
  ageValidation,
  talkValidation,
  dateValidation,
  rateValidation,
  async (req, res) => {
    const { name, age, talk } = req.body;
    const file = await fs.readFile(talkerFile);
    const content = JSON.parse(file);
    const id = content.length + 1;
    content.push({ id, name, age, talk });
    fs.writeFile(talkerFile, JSON.stringify(content));
    res.status(201).json({ id, name, age, talk });
});

app.put('/talker/:id',
  authValidation,
  nameValidation,
  ageValidation,
  talkValidation,
  dateValidation,
  rateValidation,
  async (req, res) => {
    const { id } = req.params;
    const { name, age, talk } = req.body;
    const file = await fs.readFile(talkerFile);
    const content = JSON.parse(file);
    const talkerIndex = content.findIndex((i) => i.id === Number(id));
    content[talkerIndex] = { ...content[talkerIndex], name, age, talk };
    fs.writeFile(talkerFile, JSON.stringify(content));

    res.status(200).json({ id: Number(id), name, age, talk });
});

app.delete('/talker/:id', authValidation, async (req, res) => {
  const { id } = req.params;
  const file = await fs.readFile(talkerFile);
  const content = JSON.parse(file);
  const talkerIndex = content.findIndex((i) => i.id === Number(id));
  content.splice(talkerIndex, 1);
  fs.writeFile(talkerFile, JSON.stringify(content));

  res.status(204).json(content);
});

app.listen(PORT, () => {
  console.log('Online');
});