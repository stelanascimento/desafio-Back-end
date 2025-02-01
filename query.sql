SELECT * from tarefas

SELECT id, titulo, descricao, status, data_vencimento FROM tarefas WHERE id = 1;


INSERT INTO tarefas (titulo, descricao, status, data_vencimento)
VALUES ($1, $2, $3, $4)
RETURNING id, titulo, descricao, status, data_vencimento;

UPDATE tarefas
SET titulo = $1,
	descricao = $2,
    status = $3,
    data_vencimento = $4
WHERE id = $5
RETURNING id, titulo, descricao, status, data_vencimentol;

DELETE FROM tarefas
WHERE id = $1
RETURNING id;

SELECT id, titulo, descricao, status, data_vencimento
FROM tarefas
WHERE status = $1;





