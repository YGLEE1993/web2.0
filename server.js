const express = require('express');
const app = express();
const bodyParser = require('body-parser'); 
const { save_user_information, get_total_amount, get_list_of_participants,  delete_user} = require("./models/server-db");
const path = require('path');
const publicPath = path.join(__dirname, './public');
const paypal = require('paypal-rest-sdk');
const session = require('express-session');

app.use(session (
    {
    secret: 'my decentralize app',
    cookie : {maxAge: 60000}
    }
))
/* handling all the parsing */
app.use(bodyParser.json());
app.use(express.static(publicPath))

/* paypal configuration */
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AXhFIq22tWqZ1wQDdQWBjnRTUUvaZFs7xHM4ukTp3gUOr2uyaNi-r48NbWiHiM57SA0E1J7jzZcCSS8f',
    'client_secret': 'EJFijl_dJlFtlPqFbwnOPisIj1W4kPheWRipFoA2-FXZJSL4xfUOkVSrQsVlwz-pl029SxctjIHJDOxO'
});

app.post('/post_info', async (req, res) => {
    var email = req.body.email;
    var amount = req.body.amount;
    
    if(amount <= 1){
        return_info = {};
        return_info.error = true;
        return_info.message = "The amount should be greater than 1";
        return res.send(return_info);
    }
    var fee_amount = amount * 0.9;
    var result = await save_user_information({"amount" : fee_amount, "email": email}); //save to DB
    req.session.paypal_amount = amount;

    /* Invoke paypal rest api */
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Lottery",
                    "sku": "Funding",
                    "price": amount,
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": amount
            },
            'payee': {
                'email': "manager@decentralize-lottery.io"
            },
            "description": "Lottery purchase"
        }]
    };


    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            console.log("Create Payment Response");
            console.log(payment);
            for(var i=0; i < payment.links.length; i++){
                console.log(payment.links[i].rel)
                if(payment.links[i].rel == 'approval_url'){
                    return res.send(payment.links[i].href); //redirect user 
                }
            }
        }
    });
});

app.get('/success', (req, res) => {
    const payerId = req.query.payerId;
    const paymentId = req.query.paymentId;

    var execute_payment_json = {
        "payer_id" : payerId,
        "transactions": [{
            "amount" : {
                "currency" : "USD",
                "total": req.session.paypal_amount 
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function(error, payment){
        if(error){
            console.log(error.response);
            throw error;
        }else{
            console.log(payment)
        }
    });

    /* Delete all mysql users */ 
    if(req.session.winner_picked){
        var deleted = delete_user();
    }
    req.session.winner_picked = false;
    res.redirect('http://localhost:3000')
});

app.get('/get_total_amount', async (req, res) => {
    const result = await get_total_amount();
    res.send(result)
})

app.get('/pick_winner', async (req, res) => {
    const result = await get_total_amount();
    const total_amount = result[0].total_amount;
    req.session.paypal_amount = total_amount;
    
    /* Placeholder for picking the winner
    1) query to get a list of all the participants 
    2) pick a winner */

    var list_of_participants = await get_list_of_participants();
    console.log(list_of_participants)
    const email_array = [];
    list_of_participants = JSON.parse(JSON.stringify(list_of_participants));
    list_of_participants.forEach(element => {
        email_array.push(element.email)
    });
    console.log(email_array)

    const winner_email = email_array[Math.floor(Math.random() * email_array.length)];
    req.session.winner_picked = true;
    console.log(winner_email)

    /* Create paypal payment */
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Lottery",
                    "sku": "Funding",
                    "price": req.session.paypal_amount,
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": req.session.paypal_amount
            },
            'payee': {
                'email': winner_email
            },
            "description": "Paying the winner of the lottery application"
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            console.log("Create Payment Response");
            console.log(payment);
            for(var i=0; i < payment.links.length; i++){
                console.log(payment.links[i].rel)
                if(payment.links[i].rel == 'approval_url'){
                    return res.redirect(payment.links[i].href); //redirect user 
                }
            }
        }
    });


});






app.listen(3000, () => {
    console.log("server is running on port 3000!")
});