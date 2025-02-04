const express = require('express');
const rotas = require('../routes/rotas');

const app = express();
app.use(express.json());
app.use(rotas);

app.get('/', (req, res) => {
    res.json("Tudo certo");
});


app.listen(3000, () => {
  console.log('Aplicação ouvindo na porta 3000');
});