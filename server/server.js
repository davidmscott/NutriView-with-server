require('./config/config.js');

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose.js');
const {User} = require('./models/user.js');
const {FoodItem} = require('./models/foodItem.js');
const {authenticate} = require('./middleware/authenticate.js');

const app = express();

var port = process.env.PORT;

app.use(express.static(__dirname));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth");
  res.header("Access-Control-Expose-Headers", "x-auth");
  next();
});

var baseUrl = `https://api.edamam.com/api/nutrition-data?app_id=${process.env.API_ID}&app_key=${process.env.API_KEY}&ingr=`;

app.get('/food', authenticate, (req, res) => {
	var term = req._parsedUrl.query;
	var url = `${baseUrl}${term}`;
	var date = req.query.selectedDate || Date.now();
	request(url, (error, response, body) => {
    var responseBody = JSON.parse(body);
    if (!responseBody.ingredients[0].parsed || responseBody.ingredients[0].parsed[0].quantity == 0 || _.isEmpty(responseBody.totalDaily)) {
      res.status(404).send();
      return;
    }

		var foodItem = new FoodItem({
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
    user: req.user._id
  }).then((foodList) => {
		res.send({foodList});
	}, (error) => {
		res.status(400).send(error);
	})
});

app.get('/dates', authenticate, (req, res) => {
	FoodItem.find({user: req.user._id}).then((foodList) => {
		var dateList = foodList.map((foodItem) => {
			return foodItem.date;
		});
		var dateListSummary = dateList.filter((date, index) => {
			return dateList.indexOf(date) === index;
		});
    dateList = dateListSummary.map((date) => {
      var count = 0;
      for (var i = 0; i < dateList.length; i++) {
        if (dateList[i] === date) {
          count++;
        }
      }
      return {date, count};
    });
		res.send({dateList});
	}, (error) => {
		res.status(400).send(error);
	});
});

app.post('/removefood', authenticate, (req, res) => {
	FoodItem.findOneAndRemove({
    _id: req.body.id,
    user: req.user._id
  }).then((food) => {
		if (!food) {
			return res.status(404).send();
		}
		res.send(food);
	}).catch((error) => {
		res.status(400).send(error);
	});
});

app.post('/removedate', authenticate, (req, res) => {
	FoodItem.remove({
    date: req.body.date,
    user: req.user._id
  }).then((value) => {
		res.send(res.value);
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
  User.findByCredentials(req.body.username, req.body.password).then((user) => {
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

app.post('/user/logout', authenticate, (req, res) => {
  User.findOne({username: req.user}).removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.listen(port, () => {
	console.log('Server running on port', port);
});
