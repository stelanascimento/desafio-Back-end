const conexao = require('../conexao');

const listarTarefas = async (req, res) => { 
    const tarefas = await conexao.query("select * from tarefas")
    res.json(tarefas);
};


const obterTarefa_id = async (req, res) => { 

};
const filtrarTarefa_status = async (req, res) => { 

};
const atualizarTarefa = async (req, res) => { 

};
const criarTarefa = async (req, res) => { 

};
const deletarTarefa = async (req, res) => { 

};

module.exports = {
    listarTarefas,
    obterTarefa_id,
    filtrarTarefa_status,
    atualizarTarefa,
    criarTarefa,
    deletarTarefa
};