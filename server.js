const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');

//Create Connection - Remote1
const db = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12207175',
    password: 'g5aN9Qj4Zu',
    database: 'sql12207175'
});

/*const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'sql12207175'
});*/

//Create Connection - Remote2
//const db = mysql.createConnection({
//	host : 'db4free.net',
//	user : 'km1117',
//	password : 'mobicart',
//	database : 'km_db_mysql_1117'
//});

//Create Connection - Local1
//const db = mysql.createConnection({
//	host : '127.0.0.1',
//	user : 'root',
//	password : 'admin',
//	database : 'km_db_1117'
//});

//DB Connect
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Mysql connected ..');
});

const app = express();

const port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.render('index');
});

app.post('/', function(req, res) {
    res.render('index');
});

app.listen(port, function() {
    console.log('app running')
});


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// get all brand
app.get('/skm/brandSearch/', function(req, res) {
    let sql = "SELECT * FROM brand";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// get all model
app.post('/skm/modelSearch/', function(req, res) {
    let sql = "SELECT * FROM model  WHERE bid = '" + req.body.id + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// get available models
app.post('/skm/amodelSearch/', function(req, res) {
    let sql = "SELECT DISTINCT(m.model), m.item_id FROM stock s inner join model m on s.item_id = m.item_id and m.bid = '" + req.body.id + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// get store details
app.get('/skm/storeDetails/', function(req, res) {
    let sql = "SELECT * FROM store_details";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// get all product
app.post('/skm/productSearch/', function(req, res) {
    let sql = "SELECT * FROM stock  WHERE item_id = '" + req.body.id + "' AND product_flag = 'Y'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// get all productDetails
app.post('/skm/productDetails/', function(req, res) {
    let sql = "SELECT s.*,m.model,b.brand,tg.tax_percentage FROM stock s inner join tax_group tg on s.tax_group = tg.group_id inner join model m on s.item_id = m.item_id inner join brand b on m.bid = b.bid WHERE sid = '" + req.body.id + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// get all productTaxDetails
app.post('/skm/productTaxDetails/', function(req, res) {
    let sql = "SELECT * FROM tax_group  WHERE group_id = '" + req.body.grpid + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// insert new billNo
app.post('/skm/billNo/', function(req, res) {
    let sql = "INSERT INTO bill (cust_id, sub_total, cgst_amnt, sgst_amnt, payment_type, amount, created_date, modified_date, modified_by) VALUES (" + req.body.item.custId + "," + req.body.item.subTotal + "," + req.body.item.CGST + "," + req.body.item.SGST + ",'" + req.body.item.paymentType + "'," + req.body.item.Total + "," + req.body.createdDate + "," + req.body.modifiedDate + "," + req.body.modifiedBy + ")";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// insert Delete billNo
app.post('/skm/backToSalesInvoice/', function(req, res) {
    let sql = "DELETE FROM bill WHERE bill_no = '" + req.body.billNo + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// insert delete sales-invoice
app.post('/skm/stockProductUpdate', function(req, res) {
    if (req.body.item.length > 0) {
        for (var i = 0; i < req.body.item.length; i++) {
            let sql = "UPDATE stock SET product_flag = 'Y' WHERE sku_no = '" + req.body.item[i].pSkuno + "'";
            let query = db.query(sql, (err, result) => {
                if (err) throw err;
                res.send(result);
            });
        }
    }
});

// update stock
app.post('/skm/stockUpdate/', function(req, res) {
    let sql = "UPDATE stock SET product_flag = '" + req.body.value + "' WHERE sku_no = '" + req.body.skuno + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// insert new sales-invoice
app.post('/skm/salesInvoice/', function(req, res) {
    if (req.body.item.length > 0) {
        for (var i = 0; i < req.body.item.length; i++) {
            let sql = "INSERT INTO sales_invoice (bill_no, sku_no, sold_price, unit_price, tax, cgst_amnt, sgst_amnt, created_date, modified_date, modified_by) VALUES (" + req.body.billNo + "," + req.body.item[i].pSkuno + "," + req.body.item[i].soldPrice + "," + req.body.item[i].pPrice + "," + req.body.item[i].pTax + "," + req.body.item[i].pCTax + "," + req.body.item[i].pSTax + "," + req.body.createdDate + "," + req.body.modifiedDate + "," + req.body.modifiedBy + ")";
            let query = db.query(sql, (err, result) => {
                if (err) throw err;
            });
            let sql2 = "DELETE FROM stock WHERE sku_no = '" + req.body.item[i].pSkuno + "'";
            let query2 = db.query(sql2, (err, result2) => {
                if (err) throw err;
            });
        }
    }
    res.send("done");
});

// get customer details
app.get('/skm/customerDetails/:customerPhone', function(req, res) {
    let sql = "SELECT * FROM customer_details WHERE cust_phone = '" + req.params.customerPhone + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// Add new customer id
app.post('/skm/addNewCustomer/', function(req, res) {
    let sql = "INSERT INTO customer_details (cust_name, cust_phone, cust_email, cust_address, cust_city, cust_state, cust_pincode, created_date, cust_alt_phone) VALUES ('" + req.body.name + "', '" + req.body.phone + "', '" + req.body.email + "', '" + req.body.address + "', '" + req.body.city + "', '" + req.body.state + "', '" + req.body.pincode + "','" + req.body.created + "','" + req.body.altphone + "')";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// Edit new customer id
app.post('/skm/addEditCustomer/', function(req, res) {
    let sql = "UPDATE customer_details SET cust_name = '" + req.body.name + "', cust_phone = '" + req.body.phone + "', cust_email =  '" + req.body.email + "', cust_address =  '" + req.body.address + "', cust_city = '" + req.body.city + "', cust_state = '" + req.body.state + "', cust_pincode = '" + req.body.pincode + "', created_date = '" + req.body.created + "', cust_alt_phone = '" + req.body.altphone + "' WHERE cust_id = '" + req.body.id + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// get all model mobiles
app.get('/skm/brands/', function(req, res) {
    let sql = "select m.item_id, m.model,b.brand from model m inner join brand b on m.bid = b.bid";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// get tax
app.get('/skm/taxGroup/', function(req, res) {
    let sql = "select * from tax_group";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// get tax
app.get('/skm/tax/:gid/', function(req, res) {
    let sql = "select t.tax_name,t.percentage from store_tax st inner join tax t on st.tax_id = t.tax_id and st.group_id = " + req.params.gid;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.post('/skm/productInsert/', function(req, res) {
    let sql = "INSERT INTO purchase (item_id, imei_number, details, purchase_price, selling_price, tax_group, bar_code, created_date, modified_date, modified_by) VALUES (" + req.body.item_id + ",'" + req.body.imei_number + "','" + req.body.details + "'," + req.body.purchase_price + "," + req.body.selling_price + "," + req.body.tax_group + ",'" + req.body.bar_code + "'," + req.body.createdDate + "," + req.body.modifiedDate + "," + req.body.modifiedBy + ")";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.post('/skm/stockInsert/', function(req, res) {
    let sql = "INSERT INTO stock (sku_no, item_id,imei_number,details,price,tax_group,bar_code, in_time, product_flag) VALUES (" + req.body.sku_no + "," + req.body.item_id + ",'" + req.body.imei_number + "','" + req.body.details + "'," + req.body.price + "," + req.body.tax_group + ",'" + req.body.bar_code + "'," + req.body.createdDate + ",'" + req.body.product_flag + "')";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// get all mobile brand
app.get('/skm/brand/', function(req, res) {
    let sql = "select * from brand";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/skm/taxgroup/', function(req, res) {
    let sql = "select * from tax_group";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/skm/tax/', function(req, res) {
    let sql = "select * from tax";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.post('/skm/taxgroupInsert/', function(req, res) {
    let sql = "INSERT INTO tax_group (group_name,tax_percentage) VALUES ('" + req.body.group_name + "'," + req.body.tax_percentage + ")";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);

    });
});

app.post('/skm/taxInsert/', function(req, res) {
    let sql = "INSERT INTO tax (tax_name,percentage) VALUES ('" + req.body.tax_name + "'," + req.body.percentage + ")";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);

    });
});

app.post('/skm/taxdetailsInsert/', function(req, res) {
    let sql = "INSERT INTO store_tax (group_id, tax_id) VALUES (" + req.body.group_id + "," + req.body.tax_id + ")";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);

    });
});

app.post('/skm/brandInsert/', function(req, res) {
    let sql = "INSERT INTO brand (brand) VALUES ('" + req.body.brand + "')";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);

    });
});

app.post('/skm/modelInsert/', function(req, res) {
    let sql = "INSERT INTO model (bid, model) VALUES (" + req.body.bid + ",'" + req.body.model + "')";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.post('/skm/productUpdate/', function(req, res) {
    let sql = "UPDATE purchase SET imei_number = '" + req.body.imei_number + "' ,details ='" + req.body.details + "', price=" + req.body.price + " WHERE sku_no = " + req.body.sku_no;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        let sqll = "UPDATE stock SET imei_number = '" + req.body.imei_number + "' ,details ='" + req.body.details + "', price=" + req.body.price + " WHERE sku_no = " + req.body.sku_no;
        let query = db.query(sqll, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    });
});


// login
app.post('/skm/login/', function(req, res) {
    let sql = "select u.uid,ur.rid from users u inner join users_roles ur on u.uid = ur.uid and u.username = '" + req.body.name + "' and u.password = '" + req.body.pass + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });

});

//admin-dashboard stock data
app.get('/skm/adminStockData/', function(req, res) {
    let sql = "SELECT brand.brand as Brand, model.model as Model, COUNT(stock.item_id) as Count FROM brand JOIN model ON (brand.bid = model.bid) LEFT JOIN stock ON (model.item_id = stock.item_id) GROUP BY model.item_id ORDER BY COUNT(stock.item_id) ASC";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

//admin-dashboard bill data
app.get('/skm/adminBillData/', function(req, res) {
    let sql = "SELECT bill.bill_no as BillNo, customer_details.cust_name as CustomerName, bill.amount as TotalBillAmount, bill.created_date as IssuedDate FROM bill JOIN customer_details ON (bill.cust_id = customer_details.cust_id) GROUP BY bill.bill_no ORDER BY bill.created_date ASC";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});