//RESTART 1

// packages
require("express-async-errors")
const express = require("express")
const mongoose = require("mongoose")
const config = require("config")

// routers
const { defaultRouter } = require("./src/routes/defaultRoutes")
const { userRouter } = require("./src/routes/userRoutes")
const { authRouter } = require("./src/routes/authRoutes")
const { entryRouter } = require("./src/routes/entryRoutes")

const { asyncErrorHandler } = require("./src/middleware/errorMiddleware")

// create app
const app = express()

// production
const helmet = require("helmet")
const compression = require("compression")

if (!config.get("jwtPrivateKey")) {
	throw new Error("FATAL ERROR: jwtPrivateKey is undefined")
}

// connect db
mongoose
	.connect(config.get("db"))
	.then(() => console.log("Connected to db..."))
	.catch((e) => {
		console.log("Failed to connect to db")
		console.log('e::', e::)
	})

// middleware
app.use(express.json())
app.use(helmet())
app.use(compression())

// routes
app.use("/", defaultRouter)
app.use("/api/user/", userRouter)
app.use("/api/auth", authRouter)
app.use("/api/entry", entryRouter)
app.use(asyncErrorHandler)

// listen
if (process.env.NODE_ENV !== "test") {
	const port = process.env.PORT || 3000
	app.listen(port, () => {
		console.log(`Listening on port ${port}...`)
	})
}

module.exports = app
