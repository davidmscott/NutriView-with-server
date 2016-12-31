const mongoose = require('mongoose');

var FoodItem = mongoose.model('FoodItem', {
	user: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	date: {
		type: Number,
		required: true
	},
	foodDetail: {

	}
});

module.exports = {FoodItem};
