// packages
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

// connect db
mongoose
	.connect(config.get("db"))
	.then(() => console.log("Connected to db..."))
	.catch(() => console.log("Failed to connect to db"))

// middleware
app.use(express.json())
app.use(asyncErrorHandler)
app.use(helmet())
app.use(compression())

// routes
app.use("/", defaultRouter)
app.use("/api/user/", userRouter)
app.use("/api/auth", authRouter)
app.use("/api/entry", entryRouter)

// listen
if (process.env.NODE_ENV !== "test") {
	const port = process.env.PORT || 3000
	app.listen(port, () => {
		console.log(`Listening on port ${port}...`)
	})
}

module.exports = app
