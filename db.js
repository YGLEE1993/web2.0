const mysql = require('mysql');
const config  = require('./config');
const db_config = {
    host: config.MYSQL_HOST,
    user: config.MYSQL_USER,
    password: config.MYSQL_PASSWORD,
    database: config.MYSQL_DATABASE
}

var connection;

const handleDisconnect = () => {
    connection =  mysql.createConnection(db_config);
    connection.connect((err) =>{
        if(err){
            console.log("Error connecting to db: ", err);
            setTimeout(handleDisconnect, 2000);
        }
    });
    connection.on('error', (err) => {
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            handleDisconnect();
        }else{
            throw err;
        }
    });
}

handleDisconnect();

module.exports = connection;
