const express = require('express');
const request = require('request');

const app = express();

var port = process.env.PORT || 8000;

app.use(express.static(__dirname));

var apiKey = '9c762c838016043633065dcee0261687';
var apiId = 'ab3d9cfa';
var baseUrl = `https://api.edamam.com/api/nutrition-data?app_id=${apiId}&app_key=${apiKey}&ingr=`;

app.get('/nutrients', function(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype');
	res.setHeader('Access-Control-Allow-Credentials', true);
	var term = req._parsedUrl.query;
	var url = `${baseUrl}${term}`;
	request(url, function(error, response, body) {
		res.send(response);
	});
});

app.listen(port, function() {
	console.log('Server running on port', port);
});