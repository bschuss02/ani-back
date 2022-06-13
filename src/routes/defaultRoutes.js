const express = require("express")
const defaultRouter = express.Router()

defaultRouter.get("/", (req, res) => {
	res.send("Welcome to ani")
})

module.exports = { defaultRouter }
