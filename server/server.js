const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const {ObjectID} = require('mongodb');
// const moment = require('moment') after installing moment for date formatting

const {mongoose} = require('./db/mongoose.js');
const {User} = require('./models/user.js');
const {FoodItem} = require('./models/foodItem.js');
const {authenticate} = require('./middleware/authenticate.js');

const app = express();

var port = process.env.PORT || 8000;

app.use(express.static(__dirname));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var apiKey = '9c762c838016043633065dcee0261687';
var apiId = 'ab3d9cfa';
var baseUrl = `https://api.edamam.com/api/nutrition-data?app_id=${apiId}&app_key=${apiKey}&ingr=`;

app.get('/food', authenticate, (req, res) => {
	// res.setHeader('Access-Control-Allow-Origin', '*');
	// res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	// res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype');
	// res.setHeader('Access-Control-Allow-Credentials', true);
	var term = req._parsedUrl.query;
	var url = `${baseUrl}${term}`;
	var date = req.query.selectedDate || Date.now();
	request(url, (error, response, body) => {
		if (!JSON.parse(body).ingredients[0].parsed || JSON.parse(body).ingredients[0].parsed[0].quantity == 0) {
			res.status(404).send();
		}

		var foodItem = new FoodItem({
			// user: req.query.user,
      user: req.user._id,
			date,
			foodDetail: JSON.stringify(response)
		});

		foodItem.save().then((doc) => {
			res.send(doc);
		}, (error) => {
			res.status(400).send(error);
		});
	});
});

app.get('/foods', authenticate, (req, res) => {
	FoodItem.find({
    date: req.query.date,
    user: req.user._id  //added
  }).then((foodList) => {
		res.send({foodList});
	}, (error) => {
		res.status(400).send(error);
	})
});

app.get('/dates', authenticate, (req, res) => {
	FoodItem.find({user: req.user._id}).then((foodList) => { //added
		var dateList = foodList.map((foodItem) => {
			return foodItem.date;
		});
		dateList = dateList.filter((date, index) => {
			return dateList.indexOf(date) === index;
		});
		res.send({dateList});
	}, (error) => {
		res.status(400).send(error);
	});
});

app.post('/removefood', authenticate, (req, res) => {
	FoodItem.findOneAndRemove({ //was findByIdAndRemove
    _id: req.body.id,
    user: req.user._id //added
  }).then((food) => {
		if (!food) {
			return res.status(404).send();
		}
		res.send(food);
	}).catch((error) => {
		res.status(400).send(error);
	});
});

app.post('/removedate', (req, res) => {
	FoodItem.remove({
    date: req.body.date,
    user: req.user._id //added
  }).then((res) => {
		res.send(res.result);
	}).catch((error) => {
		res.status(400).send(error);
	});
});

app.post('/user', (req, res) => {
  var user = new User({
    username: req.body.username,
    password: req.body.password
  });
  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((error) => {
    res.status(400).send(error);
  });
});

app.post('/user/login', (req, res) => {
  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((error) => {
    res.status(400).send();
  });
});

app.post('/user/logout', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.listen(port, () => {
	console.log('Server running on port', port);
});
