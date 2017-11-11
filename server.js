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
app.get('/skm/productSearch/:productName', function(req, res) {
	var queryParams = '%'+req.params.productName+'%';
	let sql = "select product_name from skm_product where product_name like '"+queryParams+"'";
	let query = db.query(sql,(err,result) => {
		if(err) throw err;
		res.send(result);
	});
});