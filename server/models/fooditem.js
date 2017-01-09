const mongoose = require('mongoose');

var FoodItem = mongoose.model('FoodItem', {
	user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	date: {
		type: String,
		required: true
	},
	foodDetail: {
		type: String,
		required: true
	}
});

module.exports = {FoodItem};
