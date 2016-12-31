const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
// const moment = require('moment') after installing moment for date formatting

const {mongoose} = require('./db/mongoose.js');
const {User} = require('./models/user.js');
const {FoodItem} = require('./models/foodItem.js');

const app = express();

var port = process.env.PORT || 8000;

app.use(express.static(__dirname));

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var apiKey = '9c762c838016043633065dcee0261687';
var apiId = 'ab3d9cfa';
var baseUrl = `https://api.edamam.com/api/nutrition-data?app_id=${apiId}&app_key=${apiKey}&ingr=`;

app.get('/nutrients', function(req, res) {
	// res.setHeader('Access-Control-Allow-Origin', '*');
	// res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	// res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype');
	// res.setHeader('Access-Control-Allow-Credentials', true);
	var term = req._parsedUrl.query;
	var url = `${baseUrl}${term}`;
	request(url, function(error, response, body) {
		console.log('request', typeof response);
		var foodItem = new FoodItem({
			user: 'Dave',
			date: 1000,
			foodDetail: JSON.stringify(response)
		});

		foodItem.save().then((doc) => {
			console.log('dbsave', typeof doc);
			res.send(JSON.parse(doc.foodDetail));
		}, (error) => {
			console.log('dberror');
			res.status(400).send(error);
		});
		// res.send(response);
	});
});

app.listen(port, function() {
	console.log('Server running on port', port);
});
