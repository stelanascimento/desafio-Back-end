const express = require('express');
const tarefas = require("./Controllers/tarefas");

const rotas = express();

//Tarefas
rotas.get('/tarefas', tarefas.listarTarefas);
rotas.get('/tarefas/:id', tarefas.obterTarefa_id);
rotas.post('/tarefas',tarefas.criarTarefa);
rotas.put('/tarefas/:id', tarefas.atualizarTarefa);
rotas.delete('/tarefas/:id', tarefas.deletarTarefa);
rotas.get('/tarefas/:status', tarefas.filtrarTarefa_status);


module.exports = rotas;