const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');


//Create Connection - Remote-Prod
const db = mysql.createConnection({
    host: 'sql3.freesqldatabase.com',
    user: 'sql3214500',
    password: 'Av52djpEBs',
    database: 'sql3214500'
});

/*
//Create Connection - Remote-Dev
const db = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12215148',
    password: '1mKykHf8kw',
    database: 'sql12215148'
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
    let sql = "INSERT INTO bill (cust_id, sub_total, cgst_amnt, sgst_amnt, payment_type, amount, due_amount, created_date, modified_date, modified_by) VALUES (" + req.body.item.custId + "," + req.body.item.subTotal + "," + req.body.item.CGST + "," + req.body.item.SGST + ",'" + req.body.item.paymentType + "'," + req.body.item.Total + "," + req.body.dueAmnt + "," + req.body.createdDate + "," + req.body.modifiedDate + "," + req.body.modifiedBy + ")";
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
    var insertFlag = false;
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
    let sql = "UPDATE customer_details SET cust_name = '" + req.body.name + "', cust_phone = '" + req.body.phone + "', cust_email =  '" + req.body.email + "', cust_address =  '" + req.body.address + "', cust_city = '" + req.body.city + "', cust_state = '" + req.body.state + "', cust_pincode = '" + req.body.pincode + "', created_date = '" + req.body.created + "', cust_alt_phone = '" + req.body.altphone + "', cust_gsttin = '" + req.body.cust_gsttin + "' WHERE cust_id = '" + req.body.id + "'";
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
    let sql = "INSERT INTO purchase (item_id, imei_number, details, purchase_price, selling_price, tax_group, bar_code, created_date, modified_date, modified_by, rom_id, ram_id, color_id) VALUES (" + req.body.item_id + ",'" + req.body.imei_number + "','" + req.body.details + "'," + req.body.purchase_price + "," + req.body.selling_price + "," + req.body.tax_group + ",'" + req.body.bar_code + "'," + req.body.createdDate + "," + req.body.modifiedDate + "," + req.body.modifiedBy + "," + req.body.rom_id + "," + req.body.ram_id + "," + req.body.color_id + ")";
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
    let sql = "SELECT brand.brand as Brand, model.model as Model, COUNT(stock.item_id) as Count FROM brand JOIN model ON (brand.bid = model.bid) LEFT JOIN stock ON (model.item_id = stock.item_id) GROUP BY model.item_id ORDER BY brand.brand,model.model ASC";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

//admin-dashboard bill data
app.get('/skm/adminBillData/', function(req, res) {
    let sql = "SELECT bill.bill_no as BillNo, customer_details.cust_name as CustomerName, bill.amount as TotalBillAmount, bill.created_date as IssuedDate FROM bill JOIN customer_details ON (bill.cust_id = customer_details.cust_id) GROUP BY bill.bill_no ORDER BY bill.bill_no DESC";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// getGeneratedBill Data
app.post('/skm/getGeneratedBill/', function(req, res) {
    let sql = "SELECT bill.created_date as billDate, bill.bill_no, bill.created_date, customer_details.cust_name, customer_details.cust_phone, customer_details.cust_alt_phone, customer_details.cust_address, customer_details.cust_city, customer_details.cust_state, customer_details.cust_gsttin, bill.payment_type, bill.amount, bill.cgst_amnt as TCGST, bill.sgst_amnt as TSGST, sales_invoice.sku_no, sales_invoice.unit_price, sales_invoice.tax/2 as TaxPer, sales_invoice.cgst_amnt, sales_invoice.sgst_amnt, (sales_invoice.cgst_amnt + sales_invoice.sgst_amnt + sales_invoice.unit_price) as pAmount, '8517' as pHSNSAC, purchase.imei_number, CONCAT(brand.brand,' ', model.model) as PName FROM bill JOIN sales_invoice on (bill.bill_no = sales_invoice.bill_no) JOIN purchase on (sales_invoice.sku_no = purchase.sku_no) JOIN model on (purchase.item_id = model.item_id) JOIN brand on (model.bid = brand.bid) JOIN customer_details ON (bill.cust_id = customer_details.cust_id) WHERE bill.bill_no = '" + req.body.billNo + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });

});

//gst-returns bill data
app.get('/skm/GSTReturnsBillData/', function(req, res) {
    let sql = "SELECT customer_details.cust_gsttin as 'GSTIN',bill.bill_no as 'InvoiceNumber', bill.created_date as 'Invoicedate', bill.amount as 'InvoiceValue', bill.payment_type as 'InvoiceType', '' as 'Rate', bill.sub_total as 'TaxableValue', (bill.cgst_amnt+bill.sgst_amnt) as 'TaxAmount' FROM bill JOIN  customer_details ON (bill.cust_id = customer_details.cust_id) GROUP BY bill.bill_no ORDER BY bill.bill_no DESC";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

//gst-returns purchase data
app.get('/skm/GSTReturnsPurchaseData/', function(req, res) {
    let sql = "SELECT seller_name, invoice_no, invoice_date, commodity_code, purchase_value, cgst_amnt, sgst_amnt, total_value FROM gst_purchase ORDER BY invoice_date DESC";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// removeGeneratedBill Data
app.post('/skm/removeGeneratedBill/', function(req, res) {
    var i = 0;
    var insertFlag = false;
    var salesDelete = false;
    var billDelete = false;
    if (null != req.body.billNo || req.body.billNo != '' || req.body.billNo != "") {
        let sql = "SELECT sku_no FROM `sales_invoice` where bill_no = '" + req.body.billNo + "'";
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
        let sql3 = "DELETE FROM `sales_invoice` WHERE  bill_no = '" + req.body.billNo + "'";
        let query3 = db.query(sql3, (err3, result3) => {
            if (err3) throw err3;
            if (result3.affectedRows > 0) {
                salesDelete = true;
            }
        });
        let sql4 = "DELETE FROM `bill` WHERE  bill_no = '" + req.body.billNo + "'";
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

//get all sellerName
app.get('/skm/sellerNameSearch/', function(req, res) {
    let sql = "select seller_name from gst_purchase";
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