const Joi = require("joi")
const mongoose = require("mongoose")
const entrySchema = mongoose.Schema(
	{
		date: { type: Date, required: true },
		location: {
			description: { type: String, required: true, max: 1000 },
			lat: { type: Number, required: true },
			lng: { type: Number, require: true },
		},
		message: { type: String, required: true, max: 150 },
		song: {
			name: { type: String, required: true, max: 500 },
			id: { type: String, required: true, max: 500 },
			href: { type: String, required: true, max: 500 },
			uri: { type: String, required: true, max: 500 },
			artist: { type: String, required: true, max: 500 },
			image: { type: String, required: true, max: 500 },
		},
		username: { type: String, required: true, max: 1000 },
		user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
	},
	{ timestamps: true },
)

const Entry = mongoose.model("Entry", entrySchema)

function validateCreateEntry(body) {
	const schema = Joi.object({
		date: Joi.date().required(),
		location: Joi.object({
			description: Joi.string()
				.required()
				.max(1000),
			lat: Joi.number().required(),
			lng: Joi.number().required(),
		}).required(),
		message: Joi.string()
			.required()
			.max(150),
		song: Joi.object({
			name: Joi.string()
				.required()
				.max(500),
			id: Joi.string()
				.required()
				.max(500),
			href: Joi.string()
				.required()
				.max(500),
			uri: Joi.string()
				.required()
				.max(500),
			artist: Joi.string()
				.required()
				.max(500),
			image: Joi.string()
				.required()
				.max(500),
		}).required(),
		username: Joi.string()
			.required()
			.max(1000),
	})
	return schema.validate(body)
}

function validateDeleteEntry(query) {
	const schema = Joi.object({
		_id: Joi.string()
			.required()
			.max(100),
	})
	return schema.validate(query)
}

module.exports = { Entry, validateCreateEntry, validateDeleteEntry }
