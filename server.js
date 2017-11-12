const express = require('express');
const router = express.Router();
const mysql = require('mysql');

//Create Connection
const db = mysql.createConnection({
	host : 'sql12.freemysqlhosting.net',
	user : 'sql12204407',
	password : 'EjFwjtcfUv',
	database : 'sql12204407'
});

//const db = mysql.createConnection({
//	host : 'db4free.net',
//	user : 'km1117',
//	password : 'mobicart',
//	database : 'km_db_mysql_1117'
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
	let sql = "select product_name from skm_product";
	let query = db.query(sql,(err,result) => {
		if(err) throw err;
		res.send(result);
	});
});

// get product details
app.get('/skm/productDetails/:productName', function(req, res) {
	let sql = "select * from skm_product where product_name = '"+req.params.productName+"'";
	let query = db.query(sql,(err,result) => {
		if(err) throw err;
		res.send(result);
	});
});