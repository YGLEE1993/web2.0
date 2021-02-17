const db = require("../db");

save_user_information = (data) => new Promise((resolve, reject) => {
    db.query('INSERT INTO lottery_information SET ?', data, (err, results, fields) => {
        if(err){
            reject('could not insert into lottery information')
        }
        resolve('Successful')
    })
});

get_total_amount = (data) => new Promise((resolve, reject) => {
    db.query('SELECT sum(amount) as total_amount FROM lottery_information', null, (err, results, fields) => {
        if(err){
            reject('could not get total amount from lottery information')
        }
        resolve(results)
    })
});


get_list_of_participants = (data) => new Promise((resolve, reject)=>{
    db.query('SELECT email FROM lottery_information', null, function(err, results, fields){
        if(err){
            reject('Could not fetch list of participants');
        }
        resolve(results);
    })
})

module.exports = {
    save_user_information,
    get_total_amount,
    get_list_of_participants
}