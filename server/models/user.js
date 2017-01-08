const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email'
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 6,
		trim: true
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
});

UserSchema.methods.toJSON = function() {
	var user = this;
	var userObject = user.toObject();
	return {
		_id: userObject._id,
		username: userObject.username
	};
};

UserSchema.methods.generateAuthToken = function() {
	var user = this;
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

	user.tokens.push({access, token});
	return user.save().then(() => {
		return token;
	});
};

UserSchema.methods.removeToken = function(token) {
	var user = this;
	return user.update({
		$pull: {
			tokens: {token}
		}
	});
};

UserSchema.statics.findByToken = function(token) {
	var User = this;
	var decoded;

	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET);
	} catch (error) {
		return Promise.reject();
	}

	return User.findOne({
		_id: decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	});
};

UserSchema.statics.findByCredentials = function(username, password) {
	var User = this;
	return User.findOne({username}).then((user) => {
		if (!user) {
			return Promise.reject();
		}

		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (error, res) => {
				if (res) {
					resolve(user);
				} else {
					reject();
				}
			});
		});
	});
};

UserSchema.pre('save', function(next) {
	var user = this;
	if (user.isModified('password')) {
		bcrypt.genSalt(10, (error, salt) => {
			bcrypt.hash(user.password, salt, (error, hash) => {
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};
