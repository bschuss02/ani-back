const express = require("express")
const bcrypt = require("bcrypt")
const { validateLogin, User } = require("../models/UserModel")
const { getError } = require("../utils/getErrorMessage")
const authRouter = express.Router()
const _ = require("lodash")

authRouter.get("/", async (req, res) => {
	const result = validateLogin(req.query)
	if (result.error) return res.status(400).end(getError(result))
	const userInfo = result.value

	let user = await User.findOne({ username: userInfo.username })
	if (!user) return res.status(400).send("Username or password is invalid")

	const isValidPassword = await bcrypt.compare(userInfo.password, user.password)
	if (!isValidPassword) {
		return res.status(400).send("Username or password is invalid")
	}

	user = _.omit(user, ["password"])

	const token = user.generateAuthToken()
	res.header("x-auth-token", token).send(user)
})

module.exports = { authRouter }
