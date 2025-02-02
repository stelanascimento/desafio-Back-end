const conexao = require('../conexao');

const listarTarefas = async (req, res) => { 
    try {
        const {rows: tarefas} = await conexao.query("select * from tarefas");
        return res.status(200).json(tarefas);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const obterTarefa_id = async (req, res) => { 
    const {id} = req.params;

    try {
        const tarefas = await conexao.query("select * from tarefas where id = $1", [id]);
        if( tarefas.rowCount=== 0){
            return res.status(404).json({ erro: "Tarefa nao encontrada" });
        }
        return res.status(200).json(tarefas.rows[0]);
    } catch (error) {
        return res.status().json(error.message);
    }

};
const filtrarTarefa_status = async (req, res) => { 
    const { status } = req.params; // 🔹 Pegando status dos parâmetros da URL

    // 🔹 Valida se o status é um dos valores permitidos
    const statusValidos = ["pendente", "realizando", "concluída"];
    if (!statusValidos.includes(status)) {
        return res.status(400).json({ erro: "Status inválido. Use: pendente, realizando ou concluída" });
    }

    try {
        const { rows: tarefas } = await conexao.query(
            "SELECT * FROM tarefas WHERE status = $1",
            [status]
        );

        return res.status(200).json(tarefas); // Retorna todas as tarefas encontradas
    } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
        return res.status(500).json({ 
            erro: "Erro interno do servidor", 
            detalhe: error.message 
        });
    }

};

const criarTarefa = async (req, res) => { 
    console.log(req.body);
    const {titulo, status, data_vencimento, descricao} = req.body;

    if(!titulo){
        return res.status(400).json({erro: "O campo titulo é obrigatório"});
    }
    if(!status){
        return res.status(400).json({erro: "O campo status é obrigatório"});
    }
    const statusValidos = ["pendente", "realizando", "concluída"];
    if (!statusValidos.includes(status)) {
        return res.status(400).json({ erro: "Status inválido. Use: pendente, realizando ou concluída" });
    }
    try {
        const query = "insert into tarefas (titulo, status, data_vencimento, descricao) values ($1, $2, $3, $4)";
        const tarefas = await conexao.query(query, [titulo, status, data_vencimento, descricao]);

        if(tarefas.rowCount === 0){
            return res.status(400).json({erro: "Não foi possível criar a tarefa"});
        }
        return res.status(200).json({mensagem: "Tarefa criada com sucesso"});
        
    } catch (error) {
        return res.status(400).json(error.message);
    }
  
};

const atualizarTarefa = async (req, res) => { 
    const {id} = req.params;
    const {titulo, status, data_vencimento, descricao} = req.body;

    try {
        const tarefas = await conexao.query("select * from tarefas where id = $1", [id]);
        if( tarefas.rowCount=== 0){
            return res.status(404).json({ erro: "Tarefa nao encontrada" });
        }
        if (!titulo && !status && !data_vencimento && !descricao) {
            return res.status(400).json({ erro: "É necessário informar ao menos um campo para atualização" });
        }
        

        const query = "update tarefas set titulo = $1, status = $2, data_vencimento = $3, descricao = $4 where id = $5";
        const tarefaAtualizada = await conexao.query(query, [titulo, status, data_vencimento, descricao, id]);
        if( tarefas.rowCount=== 0){
            return res.status(404).json({ erro: "Nao foi possivel atualizar!" });
        }

        return res.status(200).json("Tarefa atualizada com sucesso");
    } catch (error) {
        return res.status().json(error.message);
    }

};

const deletarTarefa = async (req, res) => { 
    const {id} = req.params;


    try {
        const tarefas = await conexao.query("select * from tarefas where id = $1", [id]);
        if( tarefas.rowCount=== 0){
            return res.status(404).json({ erro: "Tarefa nao encontrada" });
        }

        const query = "delete from tarefas where id = $1";
        const tarefaDeletada = await conexao.query(query, [id]);
        if( tarefas.rowCount=== 0){
            return res.status(404).json({ erro: "Nao foi possivel Deletar!" });
        }

        return res.status(200).json("Tarefa deletada com sucesso");
    } catch (error) {
        return res.status(400).json(error.message);
    }

        
};



module.exports = {
    listarTarefas,
    obterTarefa_id,
    filtrarTarefa_status,
    atualizarTarefa,
    criarTarefa,
    deletarTarefa
};