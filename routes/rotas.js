const express = require('express');
const tarefas = require("../Controllers/tarefas");

const rotas = express();

//Tarefas
rotas.get('/tarefas', tarefas.listarTarefas);
rotas.get('/tarefa/:id', tarefas.obterTarefa_id);
rotas.get('/tarefas/:status', tarefas.filtrarTarefa_status);
rotas.post('/tarefa',tarefas.criarTarefa);
rotas.put('/tarefa/:id', tarefas.atualizarTarefa);
rotas.delete('/tarefa/:id', tarefas.deletarTarefa);



module.exports = rotas;