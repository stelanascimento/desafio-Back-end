const conexao = require('../conexao');

const listarTarefas = async (req, res) => { 
    try {
        // Verifica se há tarefas no banco de dados
        const { rows: tarefas } = await conexao.query("SELECT * FROM tarefas");

        if (tarefas.length === 0) {
            return res.status(404).json({ erro: "Nenhuma tarefa encontrada" });
        }

        return res.status(200).json(tarefas);

    } catch (error) {
        console.error("Erro ao listar tarefas:", error);
        return res.status(500).json({ erro: "Erro interno do servidor", detalhe: error.message });
    }
};

//GET BY ID
const obterTarefa_id = async (req, res) => { 
    const { id } = req.params;

    // Verifica se o ID foi fornecido e é um número válido
    if (!id || isNaN(id)) {
        return res.status(400).json({ erro: "ID inválido. O ID deve ser um número." });
    }

    try {
        // Busca a tarefa pelo ID no banco
        const tarefas = await conexao.query("SELECT * FROM tarefas WHERE id = $1", [id]);

        // Verifica se a tarefa existe
        if (tarefas.rowCount === 0) {
            return res.status(404).json({ erro: "Tarefa não encontrada" });
        }

        return res.status(200).json(tarefas.rows[0]);

    } catch (error) {
        console.error("Erro ao buscar tarefa:", error);
        return res.status(500).json({ erro: "Erro interno do servidor", detalhe: error.message });
    }
};


//GET BY STATUS
const filtrarTarefa_status = async (req, res) => { 
    const { status } = req.params; // 🔹 Pegando status dos parâmetros da URL

    // Valida se o status foi enviado
    if (!status) {
        return res.status(400).json({ erro: "O parâmetro 'status' é obrigatório" });
    }

    // Valida se o status é um dos valores permitidos
    const statusValidos = ["pendente", "realizando", "concluída"];
    if (!statusValidos.includes(status.toLowerCase())) {
        return res.status(400).json({ erro: "Status inválido. Use: pendente, realizando ou concluída" });
    }

    try {
        // Busca as tarefas filtradas pelo status
        const { rows: tarefas } = await conexao.query(
            "SELECT * FROM tarefas WHERE status = $1",
            [status]
        );

        // Se não encontrar nenhuma tarefa, retorna 404
        if (tarefas.length === 0) {
            return res.status(404).json({ erro: "Nenhuma tarefa encontrada com esse status" });
        }

        return res.status(200).json(tarefas);

    } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
        return res.status(500).json({ 
            erro: "Erro interno do servidor", 
            detalhe: error.message 
        });
    }
};


//POST
const criarTarefa = async (req, res) => { 
    console.log(req.body);
    const { titulo, status, data_vencimento, descricao } = req.body;

    // Valida se o título foi enviado
    if (!titulo) {
        return res.status(400).json({ erro: "O campo 'titulo' é obrigatório" });
    }

    // Valida se o status foi enviado
    if (!status) {
        return res.status(400).json({ erro: "O campo 'status' é obrigatório" });
    }

    // Valida se o status é válido
    const statusValidos = ["pendente", "realizando", "concluída"];
    if (!statusValidos.includes(status.toLowerCase())) {
        return res.status(400).json({ erro: "Status inválido. Use: pendente, realizando ou concluída" });
    }

    // Valida a data de vencimento (se fornecida)
    let dataFormatada = null;
    if (data_vencimento) {
        const regexData = /^\d{4}-\d{2}-\d{2}$/; // Formato esperado: YYYY-MM-DD
        
        if (!regexData.test(data_vencimento)) {
            return res.status(400).json({ erro: "Formato de data inválido. Use: YYYY-MM-DD" });
        }

        const dataAtual = new Date();
        const dataVenc = new Date(data_vencimento);

        // A data deve ser futura (maior que a data atual)
        if (dataVenc <= dataAtual) {
            return res.status(400).json({ erro: "A data de vencimento deve ser uma data futura." });
        }

        dataFormatada = dataVenc.toISOString().split("T")[0]; // Normaliza para o formato YYYY-MM-DD
    }

    try {
        // Insere a tarefa no banco
        const query = `
            INSERT INTO tarefas (titulo, status, data_vencimento, descricao) 
            VALUES ($1, $2, $3, $4) RETURNING *`; // Retorna a tarefa criada
        const { rows } = await conexao.query(query, [titulo, status, dataFormatada, descricao]);

        return res.status(201).json({ mensagem: "Tarefa criada com sucesso"});

    } catch (error) {
        console.error("Erro ao criar tarefa:", error);
        return res.status(500).json({ erro: "Erro interno do servidor", detalhe: error.message });
    }
};


//PUT
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
         // Valida status (se fornecido)
         const statusValidos = ["pendente", "realizando", "concluída"];
         if (status && !statusValidos.includes(status.toLowerCase())) {
             return res.status(400).json({ erro: "Status inválido. Use: pendente, realizando ou concluída" });
         }
        
        let dataFormatada = null;
        if (data_vencimento) {
            const regexData = /^\d{4}-\d{2}-\d{2}$/; // Formato esperado: YYYY-MM-DD

            if (!regexData.test(data_vencimento)) {
                return res.status(400).json({ erro: "Formato de data inválido. Use: YYYY-MM-DD" });
            }

            const dataAtual = new Date();
            const dataVenc = new Date(data_vencimento);

            if (dataVenc <= dataAtual) {
                return res.status(400).json({ erro: "A data de vencimento deve ser uma data futura." });
            }

            dataFormatada = dataVenc.toISOString().split("T")[0]; // Normaliza para YYYY-MM-DD
        }


        const query = "update tarefas set titulo = $1, status = $2, data_vencimento = $3, descricao = $4 where id = $5";
        const tarefaAtualizada = await conexao.query(query, [titulo, status, data_vencimento, descricao, id]);
        if( tarefas.rowCount=== 0){
            return res.status(404).json({ erro: "Nao foi possivel atualizar!" });
        }

        return res.status(201).json("Tarefa atualizada com sucesso");
    } catch (error) {
        console.error("Erro ao atualizar tarefa:", error);
        return res.status(500).json({ erro: "Erro interno do servidor", detalhe: error.message });
    }

};

const deletarTarefa = async (req, res) => { 
    const {id} = req.params;


    try {
        // Verifica se o ID é um número válido
        if (isNaN(id)) {
            return res.status(400).json({ erro: "ID inválido. O ID deve ser um número." });
        }


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
        console.error("Erro ao deletar tarefa:", error);
        return res.status(500).json({ erro: "Erro interno do servidor", detalhe: error.message });
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