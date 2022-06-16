const express = require("express")
const bcrypt = require("bcrypt")
const {
	User,
	validateGenUser,
	validateNewUser,
} = require("../models/UserModel")
const { getError } = require("../utils/getErrorMessage")
const { auth } = require("../middleware/authMiddleware")
const userRouter = express.Router()

userRouter.post("/", async (req, res) => {
	const result = validateNewUser(req.body)
	if (result.error) return res.status(400).send(getError(result))
	const userInfo = result.value

	let user = await User.findOne({ username: userInfo.username })
	if (user) return res.status(400).send("Username already exists")

	const salt = await bcrypt.genSalt(10)
	const hashedPassword = await bcrypt.hash(userInfo.password, salt)
	userInfo.password = hashedPassword

	user = new User(userInfo)
	await user.save()

	const token = user.generateAuthToken()

	res.set("x-auth-token", token).send(user)
})

userRouter.get("/me", auth, async (req, res) => {
	const user = await User.findOne({ _id: req.user._id })
		.select({
			password: 0,
		})
		.populate("entries")

	if (!user) return res.status(400).send("User does not exist")

	res.send(user)
})

userRouter.delete("/", async (req, res) => {})

userRouter.get("/generate", (req, res) => {
	const result = validateGenUser(req.query)
	if (result.error) return res.status(400).send(getError(result))

	const { index } = result.value
	const digits = 4
	const paddedIndex = String(index).padStart(digits, "0")

	const user = {
		name: {
			firstname: `fname_${paddedIndex}`,
			lastname: `lname_${paddedIndex}`,
		},
		username: `uname_${paddedIndex}`,
		password: `asdfasdf`,
	}

	res.send(user)
})

module.exports = { userRouter }
