const express = require('express');
const router = express.Router();
const mysql = require('mysql');

//Create Connection - Remote1
const db = mysql.createConnection({
	host : 'sql12.freesqldatabase.com',
	user : 'sql12207175',
	password : 'g5aN9Qj4Zu',
	database : 'sql12207175'
});

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
db.connect((err) =>{
	if(err){
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

app.listen(port, function() {
	console.log('app running')
});

// get all product
app.get('/skm/productSearch/', function(req, res) {
	let sql = "select product_model from km_product_list";
	let query = db.query(sql,(err,result) => {
		if(err) throw err;
		res.send(result);
	});
});

// get product details
app.get('/skm/productDetails/:productName', function(req, res) {
	let sql = "select * from km_product_list where product_model = '"+req.params.productName+"'";
	let query = db.query(sql,(err,result) => {
		if(err) throw err;
		res.send(result);
	});
});

// get customer details
app.get('/skm/customerDetails/:customerPhone', function(req, res) {
	let sql = "select * from km_customer_details where phone = '"+req.params.customerPhone+"'";
	let query = db.query(sql,(err,result) => {
		if(err) throw err;
		res.send(result);
	});
});

// get last customer id
app.get('/skm/getCustomerId/', function(req, res) {
	let sql = "SELECT km_cust_id FROM km_customer_details  ORDER BY km_cust_id desc LIMIT 1";
	let query = db.query(sql,(err,result) => {
		if(err) throw err;
		res.send(result);
	});
});

// Add new customer id
app.get('/skm/addNewCustomer/:id/:name/:phone/:email/:address/:city/:state/:pincode/:created/:altphone', function(req, res) {
	let sql = "INSERT INTO km_customer_details (km_cust_id, name, phone, email, address, city, state, pincode, created_date, alt_phone) VALUES ('"+req.params.id+"', '"+req.params.name+"', '"+req.params.phone+"', '"+req.params.email+"', '"+req.params.address+"', '"+req.params.city+"', '"+req.params.state+"', '"+req.params.pincode+"','"+req.params.created+"','"+req.params.altphone+"')";
	let query = db.query(sql,(err,result) => {
		if(err) throw err;
		console.log("rows affected in km_customer_details : "+result.affectedRows);
		res.send(result);
	});
});