DROP TABLE IF EXISTS tarefas;

CREATE TABLE tarefas (
	id SERIAL PRIMARY KEY,
  	titulo VARCHAR(255) NOT NULL,
  	descricao TEXT,
  	status VARCHAR(20) NOT NULL CHECK (status IN ('pendente', 'realizando', 'concluida')),
  	data_vencimento DATE
);

INSERT INTO tarefas (titulo, descricao, status, data_vencimento)
VALUES 
	('Estudar API', 'Estudar como criar uma API RESTful','pendente','2025-03-11'),
    ('Estudar RFC', 'Estudar RFC1606','pendente','2025-03-11'),
    ('Estudar C++', 'Estudar C++, herenca','pendente','2025-03-01'),
    ('Estudar C', 'Fazer exercicios em C ','pendente','2025-03-02'),
    ('Estudar Servidor', 'Estudar como funciona um servidor','pendente','2025-03-13'),
    ('Estudar HTTP', 'Estudar como funciona o protocolo HTTP','pendente','2025-03-14');