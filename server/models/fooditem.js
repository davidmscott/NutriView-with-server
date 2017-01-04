const mongoose = require('mongoose');

var FoodItem = mongoose.model('FoodItem', {
	user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	date: {
		type: Number,
		required: true
	},
	foodDetail: {

	}
});

module.exports = {FoodItem};
