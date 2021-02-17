const express = require('express');
const app = express();
const bodyParser = require('body-parser'); 
const { save_user_information, get_total_amount } = require("./models/server-db");
const path = require('path');
const publicPath = path.join(__dirname, './public');
const paypal = require('paypal-rest-sdk');

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
    var result = await save_user_information({"amount" : fee_amount, "email": email});

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
                "total": 100
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
    res.redirect('http://localhost:3000')
});

app.get('/get_total_amount', async (req, res) => {
    const result = await get_total_amount();
    res.send(result)
})

app.listen(3000, () => {
    console.log("server is running on port 3000!")
});