const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');
var credentials = require('./public/cred.json');

/*
//Create Connection - Remote-Prod-store1
const db = mysql.createConnection({
    host: 'sql3.freesqldatabase.com',
    user: 'sql3214500',
    password: 'Av52djpEBs',
    database: 'sql3214500'
});

//Create Connection - Remote-Prod-store2
const db = mysql.createConnection({
    host: 'sql3.freesqldatabase.com',
    user: 'sql3231751',
    password: 'EcNKeAMq7F',
    database: 'sql3231751'
});*/

//Create Connection - Remote-Dev
const db = mysql.createConnection({
    host: 'sql3.freesqldatabase.com',
    user: 'sql3220223',
    password: 'UwPnP8hlm6',
    database: 'sql3220223'
});
/*
//Create Connection - Remote-local
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'local_db'
});*/

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
app.post('/skm/brandSearch/', function(req, res) {
    let sql = "SELECT distinct(brand.bid), brand.brand FROM brand inner join model on (model.bid = brand.bid) inner join purchase on (purchase.item_id = model.item_id) inner join stock on (stock.sku_no = purchase.sku_no) where stock.purchase_type = '" + req.body.purchase_type + "' and stock.stock_type = '" + req.body.stock_type + "' ORDER BY brand.brand ASC";
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
    let sql = "SELECT DISTINCT(m.model), m.item_id FROM stock s inner join model m on s.item_id = m.item_id and m.bid = '" + req.body.id + "' AND s.purchase_type = '" + req.body.purchase_type + "' AND s.stock_type = '" + req.body.stock_type + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// get store details
app.get('/skm/storeDetails/', function(req, res) {
    let sql = "SELECT * FROM store_details  ORDER BY sno DESC LIMIT 0,1";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// get all product
app.post('/skm/productSearch/', function(req, res) {
    let sql = "SELECT * FROM stock  WHERE item_id = '" + req.body.id + "' AND product_flag = 'Y' AND purchase_type = '" + req.body.purchase_type + "' AND stock_type = '" + req.body.stock_type + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// get all productDetails
app.post('/skm/productDetails/', function(req, res) {
    let sql = "SELECT s.*,m.model,b.brand,tg.tax_percentage, c.color, ra.ram_size, ro.rom_size FROM stock s inner join tax_group tg on s.tax_group = tg.group_id inner join model m on s.item_id = m.item_id inner join brand b on m.bid = b.bid inner join purchase p on p.sku_no = s.sku_no inner join color c on c.col_id = p.color_id inner join rom ro on ro.rom_id = p.rom_id inner join ram ra on ra.ram_id = p.ram_id WHERE sid = '" + req.body.id + "' AND s.purchase_type = '" + req.body.purchase_type + "' AND s.stock_type = '" + req.body.stock_type + "'";
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
    console.log(req.body.item)
    let sql = "INSERT INTO bill (bill_type, cust_id, sub_total, cgst_amnt, sgst_amnt, payment_type, amount, due_amount, created_date, modified_date, modified_by, dis_sub_total, dis_cgst_amnt, dis_sgst_amnt, dis_amount) VALUES ('" + req.body.item.billType + "'," + req.body.item.custId + "," + req.body.item.subTotal + "," + req.body.item.CGST + "," + req.body.item.SGST + ",'" + req.body.item.paymentType + "'," + req.body.item.Total + "," + req.body.dueAmnt + "," + req.body.createdDate + "," + req.body.modifiedDate + "," + req.body.modifiedBy + "," + req.body.item.disSubTotal + "," + req.body.item.disCGST + "," + req.body.item.disSGST + "," + req.body.item.disTotal + ")";
    console.log(sql);
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// insert new billNo bill_wholesale
app.post('/skm/billNoWholeSale/', function(req, res) {
    console.log(req.body.item)
    let sql = "INSERT INTO bill_wholesale (bill_type, cust_id, sub_total, cgst_amnt, sgst_amnt, payment_type, amount, due_amount, created_date, modified_date, modified_by, dis_sub_total, dis_cgst_amnt, dis_sgst_amnt, dis_amount) VALUES ('" + req.body.item.billType + "'," + req.body.item.custId + "," + req.body.item.subTotal + "," + req.body.item.CGST + "," + req.body.item.SGST + ",'" + req.body.item.paymentType + "'," + req.body.item.Total + "," + req.body.dueAmnt + "," + req.body.createdDate + "," + req.body.modifiedDate + "," + req.body.modifiedBy + "," + req.body.item.disSubTotal + "," + req.body.item.disCGST + "," + req.body.item.disSGST + "," + req.body.item.disTotal + ")";
    console.log(sql);
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// update billNo with billtype cancel
app.post('/skm/backToSalesInvoice/', function(req, res) {
    let sql = "UPDATE bill SET bill_type = 'C' WHERE bill_no = '" + req.body.billNo + "'";
    /*DELETE FROM bill WHERE bill_no = '" + req.body.billNo + "'";*/
    console.log(sql)
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// update billNo with billtype cancel bill_wholesale
app.post('/skm/backToSalesInvoiceWholeSale/', function(req, res) {
    let sql = "UPDATE bill_wholesale SET bill_type = 'C' WHERE bill_no = '" + req.body.billNo + "'";
    /*DELETE FROM bill WHERE bill_no = '" + req.body.billNo + "'";*/
    console.log(sql)
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});


// update billNo with billtype B
app.post('/skm/updateBillType/', function(req, res) {
    let sql = "UPDATE bill SET bill_type = 'B' WHERE bill_no = '" + req.body.billNo + "'";
    /*DELETE FROM bill WHERE bill_no = '" + req.body.billNo + "'";*/
    console.log(sql)
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// update billNo with billtype B bill_wholesale
app.post('/skm/updateBillTypeWholeSale/', function(req, res) {
    let sql = "UPDATE bill_wholesale SET bill_type = 'B' WHERE bill_no = '" + req.body.billNo + "'";
    /*DELETE FROM bill WHERE bill_no = '" + req.body.billNo + "'";*/
    console.log(sql)
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
            });
        }
    }
    res.send("DONE RESET");
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
    var insertFlag = false;
    if (req.body.item.length > 0) {
        for (var i = 0; i < req.body.item.length; i++) {
            let sql = "INSERT INTO sales_invoice (bill_no, sku_no, sold_price, unit_price, tax, cgst_amnt, sgst_amnt, created_date, modified_date, modified_by, dis_sold_price, dis_unit_price, dis_cgst_amnt, dis_sgst_amnt) VALUES (" + req.body.billNo + "," + req.body.item[i].pSkuno + "," + req.body.item[i].soldPrice + "," + req.body.item[i].pPrice + "," + req.body.item[i].pTax + "," + req.body.item[i].pCTax + "," + req.body.item[i].pSTax + "," + req.body.createdDate + "," + req.body.modifiedDate + "," + req.body.modifiedBy + "," + req.body.item[i].disSoldPrice + "," + req.body.item[i].disPrice + "," + req.body.item[i].disCTax + "," + req.body.item[i].disSTax + ")";
            let query = db.query(sql, (err, result) => {
                if (err) throw err;
            });
            let sql2 = "DELETE FROM stock WHERE sku_no = '" + req.body.item[i].pSkuno + "'";
            let query2 = db.query(sql2, (err, result2) => {
                if (err) throw err;
            });
            if (req.body.item.length >= i) {
                insertFlag = true;
            }
        }
        if (req.body.item.length >= i) {
            if (insertFlag) {
                res.send("DONE");
            } else {
                res.send("NOT DONE");
            }
        }
    }
});

// insert new sales_invoice_wholesale
app.post('/skm/salesInvoiceWholeSale/', function(req, res) {
    var insertFlag = false;
    if (req.body.item.length > 0) {
        for (var i = 0; i < req.body.item.length; i++) {
            let sql = "INSERT INTO sales_invoice_wholesale (bill_no, sku_no, sold_price, unit_price, tax, cgst_amnt, sgst_amnt, created_date, modified_date, modified_by, dis_sold_price, dis_unit_price, dis_cgst_amnt, dis_sgst_amnt) VALUES (" + req.body.billNo + "," + req.body.item[i].pSkuno + "," + req.body.item[i].soldPrice + "," + req.body.item[i].pPrice + "," + req.body.item[i].pTax + "," + req.body.item[i].pCTax + "," + req.body.item[i].pSTax + "," + req.body.createdDate + "," + req.body.modifiedDate + "," + req.body.modifiedBy + "," + req.body.item[i].disSoldPrice + "," + req.body.item[i].disPrice + "," + req.body.item[i].disCTax + "," + req.body.item[i].disSTax + ")";
            let query = db.query(sql, (err, result) => {
                if (err) throw err;
            });
            let sql2 = "DELETE FROM stock WHERE sku_no = '" + req.body.item[i].pSkuno + "'";
            let query2 = db.query(sql2, (err, result2) => {
                if (err) throw err;
            });
            if (req.body.item.length >= i) {
                insertFlag = true;
            }
        }
        if (req.body.item.length >= i) {
            if (insertFlag) {
                res.send("DONE");
            } else {
                res.send("NOT DONE");
            }
        }
    }
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
    let sql = "INSERT INTO customer_details (cust_name, cust_phone, cust_email, cust_address, cust_city, cust_state, cust_pincode, created_date, cust_alt_phone, cust_gsttin) VALUES ('" + req.body.cust_name + "', '" + req.body.cust_phone + "', '" + req.body.email + "', '" + req.body.cust_address + "', '" + req.body.cust_city + "', '" + req.body.cust_state + "', '" + req.body.pincode + "','" + req.body.created + "','" + req.body.cust_alt_phone + "','" + req.body.cust_gsttin + "')";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// Edit new customer id
app.post('/skm/addEditCustomer/', function(req, res) {
    let sql = "UPDATE customer_details SET cust_name = '" + req.body.cust_name + "', cust_phone = '" + req.body.cust_phone + "', cust_email =  '" + req.body.email + "', cust_address =  '" + req.body.cust_address + "', cust_city = '" + req.body.cust_city + "', cust_state = '" + req.body.cust_state + "', cust_pincode = '" + req.body.pincode + "', created_date = '" + req.body.created + "', cust_alt_phone = '" + req.body.cust_alt_phone + "', cust_gsttin = '" + req.body.cust_gsttin + "' WHERE cust_id = '" + req.body.id + "'";
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
    console.log("/skm/productInsert/");
    console.log(req.body);
    let sql = "INSERT INTO purchase (stock_type, purchase_type, item_id, imei_number, details, purchase_price, selling_price, tax_group, bar_code, created_date, modified_date, modified_by, rom_id, ram_id, color_id) VALUES ('" + req.body.stock_type + "','" + req.body.purchase_type + "', " + req.body.item_id + ",'" + req.body.imei_number + "','" + req.body.details + "'," + req.body.purchase_price + "," + req.body.selling_price + "," + req.body.tax_group + ",'" + req.body.bar_code + "'," + req.body.createdDate + "," + req.body.modifiedDate + "," + req.body.modifiedBy + "," + req.body.rom_id + "," + req.body.ram_id + "," + req.body.color_id + ")";
    console.log("sql : " + sql);
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.post('/skm/stockInsert/', function(req, res) {
    console.log("/skm/stockInsert/");
    console.log(req.body);
    let sql = "INSERT INTO stock (stock_type, purchase_type, sku_no, item_id,imei_number,details,price,tax_group,bar_code, in_time, product_flag) VALUES ('" + req.body.stock_type + "','" + req.body.purchase_type + "', " + req.body.sku_no + "," + req.body.item_id + ",'" + req.body.imei_number + "','" + req.body.details + "'," + req.body.price + "," + req.body.tax_group + ",'" + req.body.bar_code + "'," + req.body.createdDate + ",'" + req.body.product_flag + "')";
    console.log("sql : " + sql);
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
    let sql = "SELECT brand.brand as Brand, model.model as Model, purchase.purchase_price as Purchase, purchase.selling_price as MRP, COUNT(stock.item_id) as Count FROM purchase JOIN stock ON (stock.sku_no = purchase.sku_no AND stock.product_flag = 'Y') JOIN  model ON (model.item_id = purchase.item_id) JOIN brand ON (brand.bid = model.bid) GROUP BY model.item_id ORDER BY brand.brand,model.model ASC";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

//admin-dashboard bill data
app.post('/skm/adminBillData/', function(req, res) {
    let sql;
    if (req.body.fisYear == '2017') {
        sql = "SELECT bill.bill_no as BillNo, bill.bill_type as BillType, customer_details.cust_name as CustomerName, bill.amount as TotalBillAmount, bill.created_date as IssuedDate FROM bill_17_18 bill JOIN customer_details ON (bill.cust_id = customer_details.cust_id) GROUP BY bill.bill_no ORDER BY bill.bill_no DESC";
    } else {
        sql = "SELECT bill.bill_no as BillNo, bill.bill_type as BillType, customer_details.cust_name as CustomerName, bill.amount as TotalBillAmount, bill.created_date as IssuedDate FROM bill JOIN customer_details ON (bill.cust_id = customer_details.cust_id) GROUP BY bill.bill_no ORDER BY bill.bill_no DESC";
    }
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// getGeneratedBill Data
app.post('/skm/getGeneratedBill/', function(req, res) {
    let sql;
    if (req.body.fisYear == '2017') {
        sql = "SELECT bill.created_date as billDate, bill.bill_no, bill.created_date, customer_details.cust_name, customer_details.cust_phone, customer_details.cust_alt_phone, customer_details.cust_address, customer_details.cust_city, customer_details.cust_state, customer_details.cust_gsttin, bill.payment_type, bill.amount, bill.cgst_amnt as TCGST, bill.sgst_amnt as TSGST, sales_invoice.sku_no, sales_invoice.unit_price, sales_invoice.tax/2 as TaxPer, sales_invoice.cgst_amnt, sales_invoice.sgst_amnt, (sales_invoice.cgst_amnt + sales_invoice.sgst_amnt + sales_invoice.unit_price) as pAmount, '8517' as pHSNSAC, purchase.imei_number, CONCAT(brand.brand,' ', model.model) as PName, color.color as pColor, (CASE WHEN color.color = 'OTHER' THEN 'false' ELSE 'true' END) as isPColor FROM bill_17_18 bill JOIN sales_invoice_17_18 sales_invoice on (bill.bill_no = sales_invoice.bill_no) JOIN purchase on (sales_invoice.sku_no = purchase.sku_no) JOIN model on (purchase.item_id = model.item_id) JOIN brand on (model.bid = brand.bid) JOIN customer_details ON (bill.cust_id = customer_details.cust_id) JOIN color ON (color.col_id = purchase.color_id) JOIN rom ON (rom.rom_id = purchase.rom_id) JOIN ram ON (ram.ram_id = purchase.ram_id) WHERE bill.bill_no = '" + req.body.billNo + "'";
    } else {
        sql = "SELECT bill.created_date as billDate, bill.bill_no, bill.created_date, customer_details.cust_name, customer_details.cust_phone, customer_details.cust_alt_phone, customer_details.cust_address, customer_details.cust_city, customer_details.cust_state, customer_details.cust_gsttin, bill.payment_type, bill.amount, bill.cgst_amnt as TCGST, bill.sgst_amnt as TSGST, sales_invoice.sku_no, sales_invoice.unit_price, sales_invoice.tax/2 as TaxPer, sales_invoice.cgst_amnt, sales_invoice.sgst_amnt, (sales_invoice.cgst_amnt + sales_invoice.sgst_amnt + sales_invoice.unit_price) as pAmount, '8517' as pHSNSAC, purchase.imei_number, CONCAT(brand.brand,' ', model.model) as PName, color.color as pColor, (CASE WHEN color.color = 'OTHER' THEN 'false' ELSE 'true' END) as isPColor FROM bill JOIN sales_invoice on (bill.bill_no = sales_invoice.bill_no) JOIN purchase on (sales_invoice.sku_no = purchase.sku_no) JOIN model on (purchase.item_id = model.item_id) JOIN brand on (model.bid = brand.bid) JOIN customer_details ON (bill.cust_id = customer_details.cust_id) JOIN color ON (color.col_id = purchase.color_id) JOIN rom ON (rom.rom_id = purchase.rom_id) JOIN ram ON (ram.ram_id = purchase.ram_id) WHERE bill.bill_no = '" + req.body.billNo + "'";
    }
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });

});

// getGeneratedDisBill Data
app.post('/skm/getGeneratedDisBill/', function(req, res) {
    let sql;
    if (req.body.fisYear == '2017') {
        sql = "SELECT bill.created_date as billDate, bill.bill_no, bill.created_date, customer_details.cust_name, customer_details.cust_phone, customer_details.cust_alt_phone, customer_details.cust_address, customer_details.cust_city, customer_details.cust_state, customer_details.cust_gsttin, bill.payment_type, bill.dis_amount as amount, bill.dis_cgst_amnt as TCGST, bill.dis_sgst_amnt as TSGST, sales_invoice.sku_no, sales_invoice.dis_unit_price as unit_price, sales_invoice.tax/2 as TaxPer, sales_invoice.dis_cgst_amnt as cgst_amnt, sales_invoice.dis_sgst_amnt as sgst_amnt, (sales_invoice.dis_cgst_amnt + sales_invoice.dis_sgst_amnt + sales_invoice.dis_unit_price) as pAmount, '8517' as pHSNSAC, purchase.imei_number, CONCAT(brand.brand,' ', model.model) as PName, color.color as pColor, (CASE WHEN color.color = 'OTHER' THEN 'false' ELSE 'true' END) as isPColor FROM bill_17_18 bill JOIN sales_invoice_17_18 sales_invoice on (bill.bill_no = sales_invoice.bill_no) JOIN purchase on (sales_invoice.sku_no = purchase.sku_no) JOIN model on (purchase.item_id = model.item_id) JOIN brand on (model.bid = brand.bid) JOIN customer_details ON (bill.cust_id = customer_details.cust_id) JOIN color ON (color.col_id = purchase.color_id) JOIN rom ON (rom.rom_id = purchase.rom_id) JOIN ram ON (ram.ram_id = purchase.ram_id) WHERE bill.bill_no = '" + req.body.billNo + "'";
    } else {
        sql = "SELECT bill.created_date as billDate, bill.bill_no, bill.created_date, customer_details.cust_name, customer_details.cust_phone, customer_details.cust_alt_phone, customer_details.cust_address, customer_details.cust_city, customer_details.cust_state, customer_details.cust_gsttin, bill.payment_type, bill.dis_amount as amount, bill.dis_cgst_amnt as TCGST, bill.dis_sgst_amnt as TSGST, sales_invoice.sku_no, sales_invoice.dis_unit_price as unit_price, sales_invoice.tax/2 as TaxPer, sales_invoice.dis_cgst_amnt as cgst_amnt, sales_invoice.dis_sgst_amnt as sgst_amnt, (sales_invoice.dis_cgst_amnt + sales_invoice.dis_sgst_amnt + sales_invoice.dis_unit_price) as pAmount, '8517' as pHSNSAC, purchase.imei_number, CONCAT(brand.brand,' ', model.model) as PName, color.color as pColor, (CASE WHEN color.color = 'OTHER' THEN 'false' ELSE 'true' END) as isPColor FROM bill JOIN sales_invoice on (bill.bill_no = sales_invoice.bill_no) JOIN purchase on (sales_invoice.sku_no = purchase.sku_no) JOIN model on (purchase.item_id = model.item_id) JOIN brand on (model.bid = brand.bid) JOIN customer_details ON (bill.cust_id = customer_details.cust_id) JOIN color ON (color.col_id = purchase.color_id) JOIN rom ON (rom.rom_id = purchase.rom_id) JOIN ram ON (ram.ram_id = purchase.ram_id) WHERE bill.bill_no = '" + req.body.billNo + "'";
    }
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });

});

// removeGeneratedBill Data
app.post('/skm/removeGeneratedBill/', function(req, res) {
    let sql;
    let sql4;
    var i = 0;
    var insertFlag = false;
    var salesDelete = false;
    var billDelete = false;
    if (null != req.body.billNo || req.body.billNo != '' || req.body.billNo != "") {
        if (req.body.fisYear == '2017') {
            sql = "SELECT sku_no FROM sales_invoice_17_18 where bill_no = '" + req.body.billNo + "'";
        } else {
            sql = "SELECT sku_no FROM sales_invoice where bill_no = '" + req.body.billNo + "'";
        }
        let query = db.query(sql, (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                for (i = 0; i < result.length; i++) {
                    let sql2 = "INSERT INTO stock (sku_no, item_id,imei_number,details,price,tax_group,bar_code, in_time, product_flag) SELECT sku_no, item_id,imei_number,details,selling_price,tax_group,bar_code, created_date, 'Y' FROM purchase where sku_no = '" + result[i].sku_no + "'";
                    let query2 = db.query(sql2, (err2, result2) => {
                        if (err2) throw err2;
                    });
                    if (result.length >= i) {
                        insertFlag = true;
                    }
                }
            }
        });
        /*let sql3 = "DELETE FROM sales_invoice WHERE  bill_no = '" + req.body.billNo + "'";
        let query3 = db.query(sql3, (err3, result3) => {
            if (err3) throw err3;
            if (result3.affectedRows > 0) {
                salesDelete = true;
            }
        });*/
        if (req.body.fisYear == '2017') {
            sql4 = "UPDATE bill_17_18 SET bill_type = '" + req.body.billType + "' WHERE bill_no = '" + req.body.billNo + "'";
        } else {
            sql4 = "UPDATE bill SET bill_type = '" + req.body.billType + "' WHERE bill_no = '" + req.body.billNo + "'";
        }
        console.log("sql4 : " + sql4)
            /*DELETE FROM bill WHERE  bill_no = '" + req.body.billNo + "'";*/
        let query4 = db.query(sql4, (err4, result4) => {
            if (err4) throw err4;
            if (result4.affectedRows > 0) {
                billDelete = true;
            }
        });
        //if (result.length > i && result3.affectedRows > 0 && result4.affectedRows > 0) {
        //console.log("insertFlag :" + insertFlag + "salesDelete : " + salesDelete + " billDelete : " + billDelete)
        if (insertFlag && salesDelete && billDelete) {
            res.send("DONE");
        } else {
            res.send("NOT DONE");
        }
        //}
    }
});

//admin-dashboard bill whole sale data
app.post('/skm/adminBillWholeData/', function(req, res) {
    let sql;
    if (req.body.fisYearW == '2017') {
        sql = "SELECT bill.bill_no as BillNo, bill.bill_type as BillType, customer_details.cust_name as CustomerName, bill.amount as TotalBillAmount, bill.created_date as IssuedDate FROM bill_wholesale_17_18 bill JOIN customer_details ON (bill.cust_id = customer_details.cust_id) GROUP BY bill.bill_no ORDER BY bill.bill_no DESC";
    } else {
        sql = "SELECT bill.bill_no as BillNo, bill.bill_type as BillType, customer_details.cust_name as CustomerName, bill.amount as TotalBillAmount, bill.created_date as IssuedDate FROM bill_wholesale bill JOIN customer_details ON (bill.cust_id = customer_details.cust_id) GROUP BY bill.bill_no ORDER BY bill.bill_no DESC";
    }
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});


// getGeneratedBill Whole Data
app.post('/skm/getGeneratedBillWhole/', function(req, res) {
    let sql;
    if (req.body.fisYearW == '2017') {
        sql = "SELECT bill.created_date as billDate, bill.bill_no, bill.created_date, customer_details.cust_name, customer_details.cust_phone, customer_details.cust_alt_phone, customer_details.cust_address, customer_details.cust_city, customer_details.cust_state, customer_details.cust_gsttin, bill.payment_type, bill.amount, bill.cgst_amnt as TCGST, bill.sgst_amnt as TSGST, sales_invoice.sku_no, sales_invoice.unit_price, sales_invoice.tax/2 as TaxPer, sales_invoice.cgst_amnt, sales_invoice.sgst_amnt, (sales_invoice.cgst_amnt + sales_invoice.sgst_amnt + sales_invoice.unit_price) as pAmount, '8517' as pHSNSAC, purchase.imei_number, CONCAT(brand.brand,' ', model.model) as PName, color.color as pColor, (CASE WHEN color.color = 'OTHER' THEN 'false' ELSE 'true' END) as isPColor FROM bill_wholesale_17_18 bill JOIN sales_invoice_wholesale_17_18 sales_invoice on (bill.bill_no = sales_invoice.bill_no) JOIN purchase on (sales_invoice.sku_no = purchase.sku_no) JOIN model on (purchase.item_id = model.item_id) JOIN brand on (model.bid = brand.bid) JOIN customer_details ON (bill.cust_id = customer_details.cust_id) JOIN color ON (color.col_id = purchase.color_id) JOIN rom ON (rom.rom_id = purchase.rom_id) JOIN ram ON (ram.ram_id = purchase.ram_id) WHERE bill.bill_no = '" + req.body.billNo + "'";
    } else {
        sql = "SELECT bill.created_date as billDate, bill.bill_no, bill.created_date, customer_details.cust_name, customer_details.cust_phone, customer_details.cust_alt_phone, customer_details.cust_address, customer_details.cust_city, customer_details.cust_state, customer_details.cust_gsttin, bill.payment_type, bill.amount, bill.cgst_amnt as TCGST, bill.sgst_amnt as TSGST, sales_invoice.sku_no, sales_invoice.unit_price, sales_invoice.tax/2 as TaxPer, sales_invoice.cgst_amnt, sales_invoice.sgst_amnt, (sales_invoice.cgst_amnt + sales_invoice.sgst_amnt + sales_invoice.unit_price) as pAmount, '8517' as pHSNSAC, purchase.imei_number, CONCAT(brand.brand,' ', model.model) as PName, color.color as pColor, (CASE WHEN color.color = 'OTHER' THEN 'false' ELSE 'true' END) as isPColor FROM bill_wholesale bill JOIN sales_invoice_wholesale sales_invoice on (bill.bill_no = sales_invoice.bill_no) JOIN purchase on (sales_invoice.sku_no = purchase.sku_no) JOIN model on (purchase.item_id = model.item_id) JOIN brand on (model.bid = brand.bid) JOIN customer_details ON (bill.cust_id = customer_details.cust_id) JOIN color ON (color.col_id = purchase.color_id) JOIN rom ON (rom.rom_id = purchase.rom_id) JOIN ram ON (ram.ram_id = purchase.ram_id) WHERE bill.bill_no = '" + req.body.billNo + "'";
    }
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });

});

// getGeneratedDisBill Whole Data
app.post('/skm/getGeneratedDisBillWhole/', function(req, res) {
    let sql;
    if (req.body.fisYearW == '2017') {
        sql = "SELECT bill.created_date as billDate, bill.bill_no, bill.created_date, customer_details.cust_name, customer_details.cust_phone, customer_details.cust_alt_phone, customer_details.cust_address, customer_details.cust_city, customer_details.cust_state, customer_details.cust_gsttin, bill.payment_type, bill.dis_amount as amount, bill.dis_cgst_amnt as TCGST, bill.dis_sgst_amnt as TSGST, sales_invoice.sku_no, sales_invoice.dis_unit_price as unit_price, sales_invoice.tax/2 as TaxPer, sales_invoice.dis_cgst_amnt as cgst_amnt, sales_invoice.dis_sgst_amnt as sgst_amnt, (sales_invoice.dis_cgst_amnt + sales_invoice.dis_sgst_amnt + sales_invoice.dis_unit_price) as pAmount, '8517' as pHSNSAC, purchase.imei_number, CONCAT(brand.brand,' ', model.model) as PName, color.color as pColor, (CASE WHEN color.color = 'OTHER' THEN 'false' ELSE 'true' END) as isPColor FROM bill_wholesale_17_18 bill JOIN sales_invoice_wholesale_17_18 sales_invoice on (bill.bill_no = sales_invoice.bill_no) JOIN purchase on (sales_invoice.sku_no = purchase.sku_no) JOIN model on (purchase.item_id = model.item_id) JOIN brand on (model.bid = brand.bid) JOIN customer_details ON (bill.cust_id = customer_details.cust_id) JOIN color ON (color.col_id = purchase.color_id) JOIN rom ON (rom.rom_id = purchase.rom_id) JOIN ram ON (ram.ram_id = purchase.ram_id) WHERE bill.bill_no = '" + req.body.billNo + "'";
    } else {
        sql = "SELECT bill.created_date as billDate, bill.bill_no, bill.created_date, customer_details.cust_name, customer_details.cust_phone, customer_details.cust_alt_phone, customer_details.cust_address, customer_details.cust_city, customer_details.cust_state, customer_details.cust_gsttin, bill.payment_type, bill.dis_amount as amount, bill.dis_cgst_amnt as TCGST, bill.dis_sgst_amnt as TSGST, sales_invoice.sku_no, sales_invoice.dis_unit_price as unit_price, sales_invoice.tax/2 as TaxPer, sales_invoice.dis_cgst_amnt as cgst_amnt, sales_invoice.dis_sgst_amnt as sgst_amnt, (sales_invoice.dis_cgst_amnt + sales_invoice.dis_sgst_amnt + sales_invoice.dis_unit_price) as pAmount, '8517' as pHSNSAC, purchase.imei_number, CONCAT(brand.brand,' ', model.model) as PName, color.color as pColor, (CASE WHEN color.color = 'OTHER' THEN 'false' ELSE 'true' END) as isPColor FROM bill_wholesale bill JOIN sales_invoice_wholesale sales_invoice on (bill.bill_no = sales_invoice.bill_no) JOIN purchase on (sales_invoice.sku_no = purchase.sku_no) JOIN model on (purchase.item_id = model.item_id) JOIN brand on (model.bid = brand.bid) JOIN customer_details ON (bill.cust_id = customer_details.cust_id) JOIN color ON (color.col_id = purchase.color_id) JOIN rom ON (rom.rom_id = purchase.rom_id) JOIN ram ON (ram.ram_id = purchase.ram_id) WHERE bill.bill_no = '" + req.body.billNo + "'";
    }
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });

});

// removeGeneratedBill Whole Data
app.post('/skm/removeGeneratedBillWhole/', function(req, res) {
    let sql;
    let sql4;
    var i = 0;
    var insertFlag = false;
    var salesDelete = false;
    var billDelete = false;
    if (null != req.body.billNo || req.body.billNo != '' || req.body.billNo != "") {
        if (req.body.fisYearW == '2017') {
            sql = "SELECT sku_no FROM sales_invoice_wholesale_17_18 where bill_no = '" + req.body.billNo + "'";
        } else {
            sql = "SELECT sku_no FROM sales_invoice_wholesale where bill_no = '" + req.body.billNo + "'";
        }
        let query = db.query(sql, (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                for (i = 0; i < result.length; i++) {
                    let sql2 = "INSERT INTO stock (sku_no, item_id,imei_number,details,price,tax_group,bar_code, in_time, product_flag) SELECT sku_no, item_id,imei_number,details,selling_price,tax_group,bar_code, created_date, 'Y' FROM purchase where sku_no = '" + result[i].sku_no + "'";
                    let query2 = db.query(sql2, (err2, result2) => {
                        if (err2) throw err2;
                    });
                    if (result.length >= i) {
                        insertFlag = true;
                    }
                }
            }
        });
        /*let sql3 = "DELETE FROM sales_invoice WHERE  bill_no = '" + req.body.billNo + "'";
        let query3 = db.query(sql3, (err3, result3) => {
            if (err3) throw err3;
            if (result3.affectedRows > 0) {
                salesDelete = true;
            }
        });*/
        if (req.body.fisYearW == '2017') {
            sql4 = "UPDATE bill_wholesale_17_18 SET bill_type = '" + req.body.billType + "' WHERE bill_no = '" + req.body.billNo + "'";
        } else {
            sql4 = "UPDATE bill_wholesale_17_18 SET bill_type = '" + req.body.billType + "' WHERE bill_no = '" + req.body.billNo + "'";
        }
        console.log("sql4 : " + sql4)
            /*DELETE FROM bill WHERE  bill_no = '" + req.body.billNo + "'";*/
        let query4 = db.query(sql4, (err4, result4) => {
            if (err4) throw err4;
            if (result4.affectedRows > 0) {
                billDelete = true;
            }
        });
        //if (result.length > i && result3.affectedRows > 0 && result4.affectedRows > 0) {
        //console.log("insertFlag :" + insertFlag + "salesDelete : " + salesDelete + " billDelete : " + billDelete)
        if (insertFlag && salesDelete && billDelete) {
            res.send("DONE");
        } else {
            res.send("NOT DONE");
        }
        //}
    }
});

//gst-returns bill data
app.post('/skm/GSTReturnsBillData/', function(req, res) {
    let sql;
    if (req.body.fisYear == '2017') {
        sql = "SELECT customer_details.cust_gsttin as 'GSTIN',bill.bill_no as 'InvoiceNumber', bill.created_date as 'Invoicedate', bill.amount as 'InvoiceValue', bill.payment_type as 'InvoiceType', '' as 'Rate', bill.sub_total as 'TaxableValue', (bill.cgst_amnt+bill.sgst_amnt) as 'TaxAmount' FROM bill_17_18 bill JOIN  customer_details ON (bill.cust_id = customer_details.cust_id) WHERE bill.created_date BETWEEN " + req.body.sdate + " AND " + req.body.edate + " ORDER BY bill.bill_no DESC";
    } else {
        sql = "SELECT customer_details.cust_gsttin as 'GSTIN',bill.bill_no as 'InvoiceNumber', bill.created_date as 'Invoicedate', bill.amount as 'InvoiceValue', bill.payment_type as 'InvoiceType', '' as 'Rate', bill.sub_total as 'TaxableValue', (bill.cgst_amnt+bill.sgst_amnt) as 'TaxAmount' FROM bill JOIN  customer_details ON (bill.cust_id = customer_details.cust_id) WHERE bill.created_date BETWEEN " + req.body.sdate + " AND " + req.body.edate + " ORDER BY bill.bill_no DESC";
    }
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

//gst-returns purchase data
app.post('/skm/GSTReturnsPurchaseData/', function(req, res) {
    let sql = "SELECT seller_name, invoice_no, invoice_date, commodity_code, purchase_value, cgst_amnt, sgst_amnt, total_value FROM gst_purchase WHERE invoice_date BETWEEN " + req.body.sdate + " AND " + req.body.edate + " ORDER BY invoice_date DESC";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

//get all sellerName
app.get('/skm/sellerNameSearch/', function(req, res) {
    let sql = "SELECT DISTINCT(seller_name) FROM gst_purchase ORDER BY seller_name ASC";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

//add into gst_purchase
app.post('/skm/addGSTPurchase/', function(req, res) {
    let sql = "INSERT INTO gst_purchase (seller_name, invoice_no, invoice_date, commodity_code, purchase_value, cgst_amnt, sgst_amnt, total_value, created_date) VALUES ('" + req.body.sellerName + "','" + req.body.invoiceNo + "','" + req.body.invoiceDate + "','" + req.body.commodityCode + "','" + req.body.purchaseValue + "','" + req.body.cgstAmnt + "','" + req.body.sgstAmnt + "','" + req.body.totalValue + "','" + req.body.createdDate + "')";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});


// get all mobile color
app.get('/skm/color/', function(req, res) {
    let sql = "select * from color";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// get all mobile ram
app.get('/skm/ram/', function(req, res) {
    let sql = "select * from ram";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// get all mobile rom
app.get('/skm/rom/', function(req, res) {
    let sql = "select * from rom";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// get all mobile color
app.get('/skm/colorDetails/', function(req, res) {
    let sql = "select color from color";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// get all mobile ram
app.get('/skm/ramDetails/', function(req, res) {
    let sql = "select ram_size from ram";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// get all mobile rom
app.get('/skm/romDetails/', function(req, res) {
    let sql = "select rom_size from rom";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

//add into color
app.post('/skm/colorInsert/', function(req, res) {
    let sql = "INSERT INTO color (color) VALUES ('" + req.body.color + "')";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

//add into RAM
app.post('/skm/ramInsert/', function(req, res) {
    let sql = "INSERT INTO ram (ram_size) VALUES ('" + req.body.ram + "')";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

//add into rom
app.post('/skm/romInsert/', function(req, res) {
    let sql = "INSERT INTO rom (rom_size) VALUES ('" + req.body.rom + "')";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

//insert shop details
app.post('/skm/shopInsert/', function(req, res) {
    let sql = "INSERT INTO store_details (name,gstin,phone,mobile,email,address,city,state,pincode) VALUES ('" + req.body.name + "','" + req.body.gstin + "','" + req.body.phone + "','" + req.body.mobile + "','" + req.body.email + "','" + req.body.address + "','" + req.body.city + "','" + req.body.state + "','" + req.body.pincode + "')";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

//admin-dashboard Customer Data 
app.get('/skm/adminCustomerData/', function(req, res) {
    let sql = "SELECT * FROM customer_details GROUP BY cust_id ORDER BY cust_name ASC";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

//get imei
app.post('/skm/validateIMEI/', function(req, res) {
    let sql = "SELECT imei_number FROM purchase where imei_number = '" + req.body.imei + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

//mail sendOffers
app.post('/skm/sendOffers/', function(req, res) {
    console.log('* Before /skm/sendOffers/ sending test email' + req.body.offerLink + " : " + req.body.senderMail);
    const gmailSend = require("gmail-send")({
        user: credentials.user,
        pass: credentials.pass,
        bcc: [req.body.senderMail],
        subject: req.body.subject,
        text: 'gmail-send examples 1.1 & 1,2',
        html: '<html><body><img src="' + req.body.offerLink + '"/></body></html>',
    }, function(err, res) {
        console.log('* Inside /skm/sendOffers/ sending test email' + req.body.offerLink, err, '; res:', res);
    })();
    console.log('* After /skm/sendOffers/ sending test email' + req.body.offerLink);
    res.send("SEND");
});


//app Logger Mechanism
app.post('/skm/appLog/', function(req, res) {
    console.log(req.body.loggerData);
    res.send("LOGGED");
});

//Product return logic
app.post('/skm/retProduct/', function(req, res) {
    var insertFlag = false;
    if (req.body.product_imeis.length > 0) {
        for (var i = 0; i < req.body.product_imeis.length; i++) {
            let sql;
            if (req.body.purchase_type == 'PURCHASE') {
                sql = "UPDATE purchase SET purchase_type = 'PS-RETURNED' WHERE imei_number = '" + req.body.product_imeis[i] + "'";
            } else {
                sql = "UPDATE purchase SET purchase_type = 'WS-RETURNED' WHERE imei_number = '" + req.body.product_imeis[i] + "'";
            }
            console.log("sql : " + sql)
            let query = db.query(sql, (err, result) => {
                if (err) throw err;
            });
            let sql2 = "DELETE FROM stock WHERE imei_number = '" + req.body.product_imeis[i] + "'";
            let query2 = db.query(sql2, (err, result2) => {
                if (err) throw err;
            });
            if (req.body.product_imeis.length >= i) {
                insertFlag = true;
            }
        }
        if (req.body.product_imeis.length >= i) {
            if (insertFlag) {
                res.send("RETURNED");
            } else {
                res.send("NOT RETURNED");
            }
        }
    }
});

//Product Price Update logic
app.post('/skm/upProduct/', function(req, res) {
    var insertFlag = false;
    if (req.body.product_imeis.length > 0) {
        for (var i = 0; i < req.body.product_imeis.length; i++) {
            let sql;
            sql = "UPDATE purchase SET selling_price = '" + req.body.upPPrice + "' WHERE imei_number = '" + req.body.product_imeis[i] + "'";
            console.log("sql : " + sql)
            let query = db.query(sql, (err, result) => {
                if (err) throw err;
            });
            let sql2 = "UPDATE stock SET price = '" + req.body.upPPrice + "' WHERE imei_number = '" + req.body.product_imeis[i] + "'";
            let query2 = db.query(sql2, (err, result2) => {
                if (err) throw err;
            });
            if (req.body.product_imeis.length >= i) {
                insertFlag = true;
            }
        }
        if (req.body.product_imeis.length >= i) {
            if (insertFlag) {
                res.send("UPDATEED");
            } else {
                res.send("NOT UPDATEED");
            }
        }
    }
});

//get revenue
app.get('/skm/revenueForMonth/', function(req, res) {
    let sql = "SELECT SUM(amount) as 'Total' FROM bill WHERE bill_type = 'B' AND  MONTH(FROM_UNIXTIME(created_date)) = MONTH(CURRENT_DATE()) AND YEAR(FROM_UNIXTIME(created_date)) = YEAR(CURRENT_DATE())";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

//get purchase credit  for month
app.get('/skm/PurchaseCreditForMonth/', function(req, res) {
    let sql = "SELECT SUM(purchase.purchase_price) as 'TotalPurchase' FROM purchase INNER JOIN sales_invoice WHERE purchase.sku_no = sales_invoice.sku_no AND MONTH(FROM_UNIXTIME(purchase.created_date)) = MONTH(CURRENT_DATE()) AND YEAR(FROM_UNIXTIME(purchase.created_date)) = YEAR(CURRENT_DATE())";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

//get sales for month
app.get('/skm/SalesForMonth/', function(req, res) {
    let sql = "SELECT COUNT(bill_no) as 'Total' FROM `bill` WHERE bill_type = 'B' AND  MONTH(FROM_UNIXTIME(created_date)) = MONTH(CURRENT_DATE()) AND YEAR(FROM_UNIXTIME(created_date)) = YEAR(CURRENT_DATE())";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

//get customser for month
app.get('/skm/CustForMonth/', function(req, res) {
    let sql = "SELECT COUNT(cust_id) as 'count' FROM customer_details";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

//get Daily Sales
app.get('/skm/dailySales/', function(req, res) {
    let sql = "SELECT date_format(FROM_UNIXTIME(created_date), '%d/%m') as 'labels', SUM(amount) as 'series' FROM `bill` WHERE bill_type = 'B' AND FROM_UNIXTIME(created_date) >=CURDATE() - INTERVAL  15 DAY AND FROM_UNIXTIME(created_date)  < CURDATE() + INTERVAL  1 DAY GROUP BY date_format(FROM_UNIXTIME(created_date), '%d/%m');";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

//get Monthly Sales
app.get('/skm/monthlySales/', function(req, res) {
    let sql = "SELECT CASE WHEN MONTH(FROM_UNIXTIME(created_date)) = 1 THEN 'Jan' WHEN MONTH(FROM_UNIXTIME(created_date)) = 2 THEN 'Feb' WHEN MONTH(FROM_UNIXTIME(created_date)) = 3  THEN 'Mar' WHEN MONTH(FROM_UNIXTIME(created_date)) = 4 THEN 'Apr' WHEN MONTH(FROM_UNIXTIME(created_date)) = 5 THEN 'Mai' WHEN MONTH(FROM_UNIXTIME(created_date)) = 6 THEN 'Jun' WHEN MONTH(FROM_UNIXTIME(created_date)) = 7 THEN 'Jul' WHEN MONTH(FROM_UNIXTIME(created_date)) = 8 THEN 'Aug' WHEN MONTH(FROM_UNIXTIME(created_date)) = 9 THEN 'Sep' WHEN MONTH(FROM_UNIXTIME(created_date)) = 10 THEN 'Oct' WHEN MONTH(FROM_UNIXTIME(created_date)) = 11 THEN 'Nov' WHEN MONTH(FROM_UNIXTIME(created_date)) = 12 THEN 'Dec' ELSE MONTH(FROM_UNIXTIME(created_date)) END as 'labels', SUM(amount) as 'series' FROM `bill` WHERE bill_type = 'B' GROUP BY MONTHNAME(FROM_UNIXTIME(created_date)) order by MONTH(FROM_UNIXTIME(created_date)) asc;";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

//get Daily Profit Sales
app.get('/skm/dailyProfit/', function(req, res) {
    let sql = "SELECT sum(b.amount) - sum(p.purchase_price) as Profit FROM bill b inner join sales_invoice s on (b.bill_no = s.bill_no) inner join purchase p on (s.sku_no = p.sku_no) WHERE b.bill_type = 'B' AND DATE(FROM_UNIXTIME(b.created_date)) = DATE(CURRENT_DATE()) AND MONTH(FROM_UNIXTIME(b.created_date)) = MONTH(CURRENT_DATE()) AND YEAR(FROM_UNIXTIME(b.created_date)) = YEAR(CURRENT_DATE())";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

//get barcode IMEI
app.post('/skm/barcodeIMEI/', function(req, res) {
    let sql = "SELECT stock.imei_number,stock.price,model.model as Model FROM stock INNER JOIN purchase on (purchase.sku_no = stock.sku_no) JOIN model on (model.item_id = stock.item_id) WHERE stock.product_flag = 'Y' AND purchase.created_date BETWEEN " + req.body.sdate + " AND " + req.body.edate + " ORDER BY stock.sku_no DESC";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

//get Most Product Sales
app.get('/skm/mostProductSales/', function(req, res) {
    let sql = "SELECT CONCAT(brand.brand, '-', model.model) AS 'labels', COUNT(bill.bill_no) AS 'series' FROM bill JOIN sales_invoice ON (sales_invoice.bill_no = bill.bill_no AND bill.bill_type = 'B') JOIN purchase ON (purchase.sku_no = sales_invoice.sku_no) JOIN model ON (model.item_id = purchase.item_id) JOIN brand ON (brand.bid = model.bid) AND MONTH(FROM_UNIXTIME(bill.created_date)) = MONTH(CURRENT_DATE()) AND YEAR(FROM_UNIXTIME(bill.created_date)) = YEAR(CURRENT_DATE()) GROUP BY model.model ORDER BY series DESC LIMIT 5";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

//seller Data 
app.get('/skm/sellerData/', function(req, res) {
    let sql = "SELECT DISTINCT(seller_name) FROM gst_purchase ORDER BY seller_name ASC";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// get seller details
app.get('/skm/sellerDetails/:sellerName', function(req, res) {
    let sql = "SELECT * FROM gst_edit_purchase where seller_name = '" + req.params.sellerName + "' ORDER BY gst_edit_id ASC";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// insert seller details
app.post('/skm/insertSellerDetails/', function(req, res) {
    console.log(req.body)
    let sql = "INSERT INTO gst_edit_purchase (seller_name,  total_value, balance_value, latest_payment, payment_mode, payment_details, modified_date, modified_by)  VALUES ('" + req.body.sellarName + "'," + req.body.totallValue + "," + req.body.balanceValue + "," + req.body.latestPayment + ",'" + req.body.paymentMode + "','" + req.body.paymentDetails + "'," + req.body.modifiedDate + "," + req.body.modifiedBy + ")";
    console.log(sql);
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});