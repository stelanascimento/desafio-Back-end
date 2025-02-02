const {Pool} = require('pg');
//Observação: o node-postgres ele trabalha com requisicoes assincronas, ou seja, ele não bloqueia a aplicação, ele faz a requisição e quando a resposta chegar ele executa a função de callback.
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    table: 'tarefas',
    password: 'postgres', //not my password-I've changed it!
    port: 5432

});

//receber somente os parametros para a query, visando a segurança, quando tem passagem de valores.
const query = (text, params) => {
    return pool.query(text, params);
}

module.exports = {  
    query
};  