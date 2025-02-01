SELECT * from tarefas

SELECT id, titulo, descricao, status, data_vencimento FROM tarefas WHERE id = 1;


INSERT INTO tarefas (titulo, descricao, status, data_vencimento)
VALUES ($1, $2, $3, $4)
RETURNING id, titulo, descricao, status, data_vencimento;





