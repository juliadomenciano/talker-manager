const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  const file = await fs.readFile('./talker.json');
  const content = JSON.parse(file);
  res.status(200).json(content);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const file = await fs.readFile('./talker.json');
  const content = JSON.parse(file);
  const talker = content.find((i) => i.id === Number(id));
  if (!talker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  res.status(200).json(talker);
});

app.listen(PORT, () => {
  console.log('Online');
});
