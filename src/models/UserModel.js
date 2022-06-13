const mongoose = require("mongoose")
const Joi = require("joi")
const jwt = require("jsonwebtoken")
const config = require("config")

const userSchema = mongoose.Schema(
	{
		name: {
			firstname: { type: String, required: true, max: 100 },
			lastname: { type: String, required: true, max: 100 },
		},
		username: {
			type: String,
			required: true,
			unique: true,
		},
		password: { type: String, required: true },
		entries: {
			type: [mongoose.Schema.Types.ObjectId],
			required: true,
			ref: "Entry",
			default: [],
		},
	},
	{ timestamps: true },
)

userSchema.methods.generateAuthToken = function generateToken() {
	const token = jwt.sign(
		{
			_id: this._id,
			username: this.username,
			name: this.name,
		},
		config.get("jwtPrivateKey"),
	)
	return token
}

const User = mongoose.model("User", userSchema)

function validateNewUser(query) {
	const schema = Joi.object({
		name: Joi.object({
			firstname: Joi.string()
				.required()
				.max(100),
			lastname: Joi.string()
				.required()
				.max(100),
		}).required(),
		username: Joi.string()
			.required()
			.max(100),
		password: Joi.string()
			.required()
			.min(3)
			.max(100),
	})
	return schema.validate(query)
}

function validateLogin(query) {
	const schema = Joi.object({
		username: Joi.string()
			.required()
			.max(100),
		password: Joi.string()
			.required()
			.min(3)
			.max(100),
	})
	return schema.validate(query)
}

function validateGenUser(query) {
	const schema = Joi.object({
		index: Joi.number()
			.required()
			.integer()
			.min(0)
			.max(9999),
	})
	return schema.validate(query)
}

module.exports = { User, validateGenUser, validateLogin, validateNewUser }
