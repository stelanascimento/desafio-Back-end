const {Pool} = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    table: 'tarefas',
    password: '40028922',
    port: 5432

});

//receber somente os parametros para a query, visando a segurança, quando tem passagem de valores.
const query = (text, params) => {
    return pool.query(text, params);
}

module.exports = {  
    query
};  