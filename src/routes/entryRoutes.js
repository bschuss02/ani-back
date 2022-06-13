const express = require("express")
const { auth } = require("../middleware/authMiddleware")
const {
	validateCreateEntry,
	Entry,
	validateDeleteEntry,
} = require("../models/EntryModel")
const { User } = require("../models/UserModel")
const { getError } = require("../utils/getErrorMessage")
const entryRouter = express.Router()

entryRouter.post("/", auth, async (req, res) => {
	const result = validateCreateEntry(req.body)
	if (result.error) return res.status(400).send(getError(result))

	const entryInfo = result.value

	const user = await User.findOne({ username: entryInfo.username })
	if (!user) res.status(400).send("No user exists with that username")

	entryInfo.user = user._id

	const entry = new Entry(entryInfo)
	await entry.save()

	user.entries.splice(0, 0, entry._id)
	await user.save()

	res.send(entry)
})

entryRouter.delete("/", auth, async (req, res) => {
	const result = validateDeleteEntry(req.query)
	if (result.error) return res.status(400).send(getError(result))

	const entryId = result.value._id
	const deletedEntry = await Entry.deleteOne({ _id: entryId })
	if (!deletedEntry) return res.status(400).send("Post does not exist")

	const user = await User.findOne({ _id: req.user._id })
	if (!user) return res.status(400).send("User does not exist")

	user.entries = user.entries.filter(
		(otherId) => otherId.toString() !== entryId,
	)
	await user.save()

	res.send(deletedEntry)
})

module.exports = { entryRouter }
