const { Client } = require('pg');
//const pool = new Client.Pool();
 
const client = new Client({
    user: 'pgadmin_user',
    host: 'localhost',
    database: 'bbsim',
    password: 'new_password',
    port: '5432'
});

client.connect();

module.exports.client = client;